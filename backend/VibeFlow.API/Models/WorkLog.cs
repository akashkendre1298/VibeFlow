using System.ComponentModel.DataAnnotations;

namespace VibeFlow.API.Models;

public class WorkLog
{
    public int Id { get; set; }

    public int TaskItemId { get; set; }
    public TaskItem? TaskItem { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    [Required]
    public decimal Hours { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
}
