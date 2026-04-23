using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using VibeFlow.API.Services;
using Xunit;

namespace VibeFlow.Tests;

public class TaskServiceTests
{
    private VibeFlowDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<VibeFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new VibeFlowDbContext(options);
    }

    [Fact]
    public async Task UpdateAssigneeAsync_ShouldRecordHistory()
    {
        // Arrange
        var db = GetDbContext();
        var user1 = new User { Id = 1, Email = "u1@test.com", Name = "User 1" };
        var user2 = new User { Id = 2, Email = "u2@test.com", Name = "User 2" };
        var task = new TaskItem { Id = 1, Title = "Test Task", CreatedById = 1, AssigneeId = 1 };
        
        db.Users.AddRange(user1, user2);
        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        var service = new TaskService(db);

        // Act
        await service.UpdateAssigneeAsync(taskId: 1, newAssigneeId: 2, changedById: 1);

        // Assert
        var history = await db.AssignmentHistories.FirstOrDefaultAsync();
        history.Should().NotBeNull();
        history!.OldAssigneeId.Should().Be(1);
        history.NewAssigneeId.Should().Be(2);
        history.ChangedById.Should().Be(1);
    }

    [Fact]
    public async Task CreateTaskAsync_ShouldDefaultToBacklogAndNoAssignee()
    {
        // Arrange
        var db = GetDbContext();
        var service = new TaskService(db);

        // Act
        var task = await service.CreateTaskAsync("New Task", creatorId: 1);

        // Assert
        task.Status.Should().Be(VibeFlow.API.Models.TaskStatus.Backlog);
        task.AssigneeId.Should().BeNull();
        task.CreatedById.Should().Be(1);
    }

    [Fact]
    public async Task LogWorkAsync_ShouldCreateWorkLog()
    {
        // Arrange
        var db = GetDbContext();
        var task = new TaskItem { Id = 1, Title = "T", CreatedById = 1 };
        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        var service = new TaskService(db);

        // Act
        await service.LogWorkAsync(taskId: 1, userId: 1, hours: 3.5m, description: "Worked hard");

        // Assert
        var log = await db.WorkLogs.FirstOrDefaultAsync();
        log.Should().NotBeNull();
        log!.Hours.Should().Be(3.5m);
        log.Description.Should().Be("Worked hard");
    }

    [Fact]
    public async Task UpdateAssigneeAsync_ShouldNotCreateHistoryIfAssigneeIsSame()
    {
        // Arrange
        var db = GetDbContext();
        var task = new TaskItem { Id = 1, Title = "Test Task", CreatedById = 1, AssigneeId = 1 };
        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        var service = new TaskService(db);

        // Act
        await service.UpdateAssigneeAsync(taskId: 1, newAssigneeId: 1, changedById: 1);

        // Assert
        var historyCount = await db.AssignmentHistories.CountAsync();
        historyCount.Should().Be(0); // Should not create history for same assignee
    }

    [Fact]
    public async Task UpdateAssigneeAsync_ShouldHandleNonExistentTask()
    {
        // Arrange
        var db = GetDbContext();
        var service = new TaskService(db);

        // Act & Assert
        // Should not throw exception
        await service.Awaiting(s => s.UpdateAssigneeAsync(taskId: 999, newAssigneeId: 1, changedById: 1))
            .Should().NotThrowAsync();
    }
}
