using Microsoft.EntityFrameworkCore;
using VibeFlow.API.Data;
using VibeFlow.API.Models;

namespace VibeFlow.API.Services;

public interface ITaskService
{
    Task<TaskItem> CreateTaskAsync(string title, int creatorId, VibeFlow.API.Models.TaskStatus status = VibeFlow.API.Models.TaskStatus.Backlog, string description = "", TaskPriority priority = TaskPriority.Medium, int? assigneeId = null, DateTime? dueDate = null);
    Task UpdateAssigneeAsync(int taskId, int? newAssigneeId, int changedById);
    Task LogDueDateChangeAsync(int taskId, DateTime? oldDueDate, DateTime? newDueDate, int changedById);
    Task LogWorkAsync(int taskId, int userId, decimal hours, string description);
}

public class TaskService : ITaskService
{
    private readonly VibeFlowDbContext _context;

    public TaskService(VibeFlowDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItem> CreateTaskAsync(string title, int creatorId, VibeFlow.API.Models.TaskStatus status = VibeFlow.API.Models.TaskStatus.Backlog, string description = "", TaskPriority priority = TaskPriority.Medium, int? assigneeId = null, DateTime? dueDate = null)
    {
        var task = new TaskItem
        {
            Title = title,
            Description = description,
            CreatedById = creatorId,
            Status = status,
            Priority = priority,
            AssigneeId = assigneeId,
            DueDate = dueDate.HasValue ? DateTime.SpecifyKind(dueDate.Value, DateTimeKind.Utc) : null
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        if (assigneeId.HasValue)
        {
            var history = new AssignmentHistory
            {
                TaskItemId = task.Id,
                OldAssigneeId = null,
                NewAssigneeId = assigneeId,
                ChangedById = creatorId,
                ChangedAt = DateTime.UtcNow
            };
            _context.AssignmentHistories.Add(history);
            await _context.SaveChangesAsync();
        }

        return task;
    }

    public async Task UpdateAssigneeAsync(int taskId, int? newAssigneeId, int changedById)
    {
        var task = await _context.Tasks.FindAsync(taskId);
        if (task == null) return;

        int? oldAssigneeId = task.AssigneeId;
        
        if (oldAssigneeId == newAssigneeId) return;

        task.AssigneeId = newAssigneeId;

        var history = new AssignmentHistory
        {
            TaskItemId = taskId,
            OldAssigneeId = oldAssigneeId,
            NewAssigneeId = newAssigneeId,
            ChangedById = changedById,
            ChangedAt = DateTime.UtcNow
        };

        _context.AssignmentHistories.Add(history);
        await _context.SaveChangesAsync();
    }

    public async Task LogDueDateChangeAsync(int taskId, DateTime? oldDueDate, DateTime? newDueDate, int changedById)
    {
        var history = new AssignmentHistory
        {
            TaskItemId = taskId,
            OldDueDate = oldDueDate,
            NewDueDate = newDueDate,
            ChangedById = changedById,
            ChangedAt = DateTime.UtcNow
        };

        _context.AssignmentHistories.Add(history);
        await _context.SaveChangesAsync();
    }

    public async Task LogWorkAsync(int taskId, int userId, decimal hours, string description)
    {
        var log = new WorkLog
        {
            TaskItemId = taskId,
            UserId = userId,
            Hours = hours,
            Description = description,
            LoggedAt = DateTime.UtcNow
        };

        _context.WorkLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
