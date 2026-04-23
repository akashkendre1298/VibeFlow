using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using VibeFlow.API.Services;

namespace VibeFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly VibeFlowDbContext _context;
    private readonly ITaskService _taskService;

    public TasksController(VibeFlowDbContext context, ITaskService taskService)
    {
        _context = context;
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var tasks = await _context.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.CreatedBy)
            .OrderBy(t => t.Order)
            .ThenByDescending(t => t.CreatedAt)
            .ToListAsync();
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
    {
        if (request.Title.Length > 255) return BadRequest("Title too long");
        
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var task = await _taskService.CreateTaskAsync(request.Title, userId, request.Status, request.Description ?? "", request.Priority, request.AssigneeId, request.DueDate);
        
        // Re-fetch using AsNoTracking to ensure navigation properties (like Assignee) are correctly populated for the UI
        var taskWithDetails = await _context.Tasks
            .AsNoTracking()
            .Include(t => t.Assignee)
            .Include(t => t.CreatedBy)
            .FirstOrDefaultAsync(t => t.Id == task.Id);

        return Ok(taskWithDetails);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskRequest request)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (request.Status.HasValue) task.Status = request.Status.Value;
        if (request.Priority.HasValue) task.Priority = request.Priority.Value;
        if (request.Description != null) task.Description = request.Description;
        if (request.DueDate.HasValue) task.DueDate = request.DueDate.Value;
        if (request.Title != null) task.Title = request.Title;

        if (request.AssigneeId.HasValue || request.ClearAssignee == true)
        {
            await _taskService.UpdateAssigneeAsync(id, request.ClearAssignee == true ? null : request.AssigneeId, userId);
        }

        if (request.Order.HasValue)
        {
            task.Order = (int)request.Order.Value;
        }

        await _context.SaveChangesAsync();

        var updatedTask = await _context.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.CreatedBy)
            .FirstOrDefaultAsync(t => t.Id == id);

        return Ok(updatedTask);
    }

    [HttpPost("{id}/worklogs")]
    public async Task<IActionResult> LogWork(int id, [FromBody] LogWorkRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _taskService.LogWorkAsync(id, userId, request.Hours, request.Description);
        return Ok();
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(int id)
    {
        var history = await _context.AssignmentHistories
            .Include(h => h.OldAssignee)
            .Include(h => h.NewAssignee)
            .Include(h => h.ChangedBy)
            .Where(h => h.TaskItemId == id)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
        return Ok(history);
    }

    [HttpGet("{id}/worklogs")]
    public async Task<IActionResult> GetWorkLogs(int id)
    {
        var logs = await _context.WorkLogs
            .Include(l => l.User)
            .Where(l => l.TaskItemId == id)
            .OrderByDescending(l => l.LoggedAt)
            .ToListAsync();
        return Ok(logs);
    }
}

public record CreateTaskRequest(string Title, VibeFlow.API.Models.TaskStatus Status, string? Description = "", TaskPriority Priority = TaskPriority.Medium, int? AssigneeId = null, DateTime? DueDate = null);
public record UpdateTaskRequest(VibeFlow.API.Models.TaskStatus? Status, TaskPriority? Priority, string? Description, int? AssigneeId, bool? ClearAssignee, decimal? Order, DateTime? DueDate, string? Title);
public record LogWorkRequest(decimal Hours, string Description);
