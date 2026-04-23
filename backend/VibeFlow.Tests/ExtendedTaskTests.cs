using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using VibeFlow.API.Services;
using Xunit;

namespace VibeFlow.Tests;

public class ExtendedTaskTests
{
    private VibeFlowDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<VibeFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new VibeFlowDbContext(options);
    }

    [Fact]
    public async Task CreateTaskAsync_WithTitleExactly255Chars_ShouldSucceed()
    {
        // Arrange
        var db = GetDbContext();
        var service = new TaskService(db);
        var title = new string('A', 255);

        // Act
        var task = await service.CreateTaskAsync(title, creatorId: 1);

        // Assert
        task.Should().NotBeNull();
        task.Title.Length.Should().Be(255);
    }

    [Fact]
    public async Task LogWorkAsync_MultipleEntries_ShouldSumCorrectly()
    {
        // Arrange
        var db = GetDbContext();
        var task = new TaskItem { Id = 1, Title = "Test", CreatedById = 1 };
        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        var service = new TaskService(db);

        // Act
        await service.LogWorkAsync(1, 1, 1.5m, "Work 1");
        await service.LogWorkAsync(1, 1, 2.7m, "Work 2");

        // Assert
        var totalHours = await db.WorkLogs.Where(w => w.TaskItemId == 1).SumAsync(w => w.Hours);
        totalHours.Should().Be(4.2m);
    }

    [Fact]
    public async Task AssignmentHistory_ShouldBeOrderedByTimestampDesc()
    {
        // Arrange
        var db = GetDbContext();
        var task = new TaskItem { Id = 1, Title = "Test", CreatedById = 1, AssigneeId = 1 };
        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        var service = new TaskService(db);

        // Act
        await service.UpdateAssigneeAsync(1, 2, 1); // First change
        await Task.Delay(10); // Ensure timestamp difference
        await service.UpdateAssigneeAsync(1, 3, 1); // Second change

        // Assert
        var history = await db.AssignmentHistories
            .Where(h => h.TaskItemId == 1)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();

        history.Should().HaveCount(2);
        history[0].NewAssigneeId.Should().Be(3);
        history[1].NewAssigneeId.Should().Be(2);
    }
}
