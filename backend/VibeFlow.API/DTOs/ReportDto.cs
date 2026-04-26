namespace VibeFlow.API.DTOs;

public class ReportDto
{
    public List<TaskReportDto> Tasks { get; set; } = new();
    public List<UserReportDto> UserReports { get; set; } = new();
    public List<WorkLogDetailDto> WorkLogs { get; set; } = new();
    public decimal GrandTotalHours { get; set; }
}

public class WorkLogDetailDto
{
    public int Id { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public decimal Hours { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime LoggedAt { get; set; }
}

public class TaskReportDto
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string AssigneeName { get; set; } = string.Empty;
    public decimal TotalHours { get; set; }
    public DateTime? LatestDueDate { get; set; }
}

public class UserReportDto
{
    public string UserName { get; set; } = string.Empty;
    public decimal TotalHours { get; set; }
}
