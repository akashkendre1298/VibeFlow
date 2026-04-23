using System.ComponentModel.DataAnnotations;

namespace VibeFlow.API.Models;

public class TaskItem
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TaskStatus Status { get; set; } = TaskStatus.Backlog;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public int? AssigneeId { get; set; }
    public User? Assignee { get; set; }

    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    public DateTime? DueDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public decimal Order { get; set; }

    public List<WorkLog> WorkLogs { get; set; } = new();
    public List<AssignmentHistory> AssignmentHistories { get; set; } = new();
}
