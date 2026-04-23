using Microsoft.EntityFrameworkCore;
using VibeFlow.API.Data;
using VibeFlow.API.DTOs;

namespace VibeFlow.API.Services;

public interface IReportService
{
    Task<ReportDto> GetTimeReportAsync();
}

public class ReportService : IReportService
{
    private readonly VibeFlowDbContext _context;

    public ReportService(VibeFlowDbContext context)
    {
        _context = context;
    }

    public async Task<ReportDto> GetTimeReportAsync()
    {
        var tasks = await _context.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.WorkLogs)
            .ToListAsync();

        var taskReports = tasks.Select(t => new TaskReportDto
        {
            TaskId = t.Id,
            Title = t.Title,
            Status = t.Status.ToString(),
            AssigneeName = t.Assignee?.Name ?? "Unassigned",
            TotalHours = t.WorkLogs.Sum(w => w.Hours)
        }).ToList();

        var allUsers = await _context.Users.ToListAsync();
        var workLogs = await _context.WorkLogs.ToListAsync();

        var userReports = allUsers.Select(u => new UserReportDto
        {
            UserName = u.Name,
            TotalHours = workLogs.Where(w => w.UserId == u.Id).Sum(w => w.Hours)
        })
        .OrderByDescending(r => r.TotalHours)
        .ToList();

        var allWorkLogs = await _context.WorkLogs
            .Include(w => w.TaskItem)
            .Include(w => w.User)
            .OrderByDescending(w => w.LoggedAt)
            .Select(w => new WorkLogDetailDto
            {
                Id = w.Id,
                TaskTitle = w.TaskItem != null ? w.TaskItem.Title : "Deleted Task",
                UserName = w.User != null ? w.User.Name : "Unknown",
                Hours = w.Hours,
                Description = w.Description,
                LoggedAt = w.LoggedAt
            })
            .ToListAsync();

        return new ReportDto
        {
            Tasks = taskReports,
            UserReports = userReports,
            WorkLogs = allWorkLogs,
            GrandTotalHours = taskReports.Sum(r => r.TotalHours)
        };
    }
}
