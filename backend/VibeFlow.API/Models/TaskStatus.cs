namespace VibeFlow.API.Models;

public enum TaskStatus
{
    Backlog,
    ToDo,
    InProgress,
    Review,
    QA,
    Done,
    OnHold,
    Cancelled
}

public enum TaskPriority
{
    Low,
    Medium,
    High,
    Urgent
}
