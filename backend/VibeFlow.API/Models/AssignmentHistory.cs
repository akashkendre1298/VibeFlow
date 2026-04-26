namespace VibeFlow.API.Models;

public class AssignmentHistory
{
    public int Id { get; set; }

    public int TaskItemId { get; set; }
    public TaskItem? TaskItem { get; set; }

    public int? OldAssigneeId { get; set; }
    public User? OldAssignee { get; set; }

    public int? NewAssigneeId { get; set; }
    public User? NewAssignee { get; set; }

    public int ChangedById { get; set; }
    public User? ChangedBy { get; set; }

    public DateTime? OldDueDate { get; set; }
    public DateTime? NewDueDate { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}
