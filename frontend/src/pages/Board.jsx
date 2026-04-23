import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import api from '../services/api';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskModal from '../components/TaskModal';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';

const COLUMNS = [
  { id: 0, title: 'Backlog' },
  { id: 1, title: 'To Do' },
  { id: 2, title: 'In Progress' },
  { id: 3, title: 'Review' },
  { id: 4, title: 'QA' },
  { id: 5, title: 'Done' },
  { id: 6, title: 'On Hold' },
  { id: 7, title: 'Cancelled' }
];

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status.toString() === statusFilter;
      const matchesAssignee = assigneeFilter === 'all' ||
        (assigneeFilter === 'unassigned' && !task.assigneeId) ||
        (task.assigneeId?.toString() === assigneeFilter);
      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [tasks, searchTerm, statusFilter, assigneeFilter]);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    setTasks(prev => {
      const activeTask = prev.find(t => t.id === activeId);
      if (!activeTask) return prev;

      // Find the target status
      let overStatus = null;

      if (typeof overId === 'string' && overId.startsWith('column-')) {
        overStatus = parseInt(overId.replace('column-', ''));
      } else {
        const overTask = prev.find(t => t.id === overId);
        overStatus = overTask?.status;
      }

      if (overStatus === null || overStatus === undefined) return prev;

      const activeIndex = prev.findIndex(t => t.id === activeId);
      const overIndex = prev.findIndex(t => t.id === overId);

      let newTasks = [...prev];
      let finalStatus = activeTask.status;

      // Update status if moved to different column
      if (activeTask.status !== overStatus) {
        newTasks[activeIndex] = { ...newTasks[activeIndex], status: overStatus };
        finalStatus = overStatus;
      }

      // Reorder
      if (activeId !== overId && overIndex !== -1) {
        newTasks = arrayMove(newTasks, activeIndex, overIndex);
      }

      // Save to backend
      api.patch(`/tasks/${activeId}`, {
        status: finalStatus,
        order: overIndex !== -1 ? overIndex : 0
      }).catch(() => fetchData());

      return newTasks;
    });
  }, [fetchData]);

  const handleAddTask = useCallback(async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks(prev => [res.data, ...prev]);
    } catch (err) {
      alert(err.response?.data || "Failed to add task");
    }
  }, []);

  const openTask = useCallback((task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const groupedTasks = useMemo(() => {
    return COLUMNS.reduce((acc, col) => {
      acc[col.id] = filteredTasks.filter(t => t.status === col.id);
      return acc;
    }, {});
  }, [filteredTasks]);

  const activeTask = useMemo(() =>
    activeId ? tasks.find(t => t.id === activeId) : null,
    [activeId, tasks]
  );

  const handleTaskUpdate = useCallback(async () => {
    await fetchData();
    // Update the selectedTask with the fresh data from the tasks array
    setTasks(currentTasks => {
      const updated = currentTasks.find(t => t.id === selectedTask?.id);
      if (updated) setSelectedTask(updated);
      return currentTasks;
    });
  }, [fetchData, selectedTask?.id]);

  return (
    <div className="app-container">
      {/* <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        users={users}
      /> */}


      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          users={users}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="page-content">
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '8px' }}>Project Board</h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>Manage and track your team's tasks in real-time.</p>
          </div>

          <div className="kanban-board" style={{ padding: 0 }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {COLUMNS.map(col => (
                <Column
                  key={col.id}
                  id={`column-${col.id}`}
                  title={col.title}
                  tasks={groupedTasks[col.id] || []}
                  onTaskClick={openTask}
                  onAddTask={handleAddTask}
                  showAddButton={col.id === 0}
                  users={users}
                />
              ))}
              <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? (
                  <TaskCard task={activeTask} isOverlay />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default Board;
