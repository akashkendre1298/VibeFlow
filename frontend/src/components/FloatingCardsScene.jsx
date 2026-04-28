import React from 'react';

const FloatingCardsScene = () => {
  return (
    <div className="floating-cards-scene">
      <div className="float-wrapper wrap-1">
        <div className="floating-card">
          <span className="badge" style={{background: '#595959', color: 'white'}}>Backlog</span>
          <div className="card-title">Setup Docker Compose DB</div>
          <div className="card-footer"><div className="avatar"></div></div>
        </div>
      </div>

      <div className="float-wrapper wrap-2">
        <div className="floating-card">
          <span className="badge badge-blue">To Do</span>
          <div className="card-title">Implement JWT Authentication</div>
          <div className="card-footer"><div className="avatar"></div></div>
        </div>
      </div>

      <div className="float-wrapper wrap-3">
        <div className="floating-card">
          <span className="badge badge-green">In Progress</span>
          <div className="card-title">Develop React Kanban Board</div>
          <div className="card-footer"><div className="avatar"></div></div>
        </div>
      </div>

      <div className="float-wrapper wrap-4">
        <div className="floating-card">
          <span className="badge" style={{background: '#a29bfe', color: 'white'}}>Review</span>
          <div className="card-title">Code Review: Tasks API</div>
        </div>
      </div>

      <div className="float-wrapper wrap-5">
        <div className="floating-card">
          <span className="badge" style={{background: '#ff9f43', color: 'white'}}>QA</span>
          <div className="card-title">Test Drag & Drop Logic</div>
          <div className="card-footer"><div className="avatar"></div></div>
        </div>
      </div>

      <div className="float-wrapper wrap-6">
        <div className="floating-card">
          <span className="badge" style={{background: '#38b27a', color: 'white'}}>Done</span>
          <div className="card-title">Create Project PRD</div>
        </div>
      </div>

      <div className="float-wrapper wrap-7">
        <div className="floating-card">
          <span className="badge" style={{background: '#8c8c8c', color: 'white'}}>On Hold</span>
          <div className="card-title">Refactor AuthContext</div>
        </div>
      </div>

      <div className="float-wrapper wrap-8">
        <div className="floating-card">
          <span className="badge" style={{background: '#f5222d', color: 'white'}}>Cancelled</span>
          <div className="card-title">Migrate to Redux</div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCardsScene;
