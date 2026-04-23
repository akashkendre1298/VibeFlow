using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using VibeFlow.API.Services;
using Xunit;

namespace VibeFlow.Tests;

public class ReportServiceTests
{
    private VibeFlowDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<VibeFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new VibeFlowDbContext(options);
    }

    [Fact]
    public async Task GetTimeReportAsync_ShouldSumWorkLogsCorrectly()
    {
        // Arrange
        var db = GetDbContext();
        var user = new User { Id = 1, Email = "test@test.com", Name = "Tester" };
        var task = new TaskItem { Id = 1, Title = "Test Task", CreatedById = 1 };
        
        db.Users.Add(user);
        db.Tasks.Add(task);
        db.WorkLogs.AddRange(
            new WorkLog { TaskItemId = 1, UserId = 1, Hours = 2.5m, Description = "Work 1" },
            new WorkLog { TaskItemId = 1, UserId = 1, Hours = 1.5m, Description = "Work 2" }
        );
        await db.SaveChangesAsync();

        var service = new ReportService(db);

        // Act
        var report = await service.GetTimeReportAsync();

        // Assert
        report.Tasks.Should().HaveCount(1);
        report.Tasks[0].TotalHours.Should().Be(4.0m);
        report.GrandTotalHours.Should().Be(4.0m);
    }

    [Fact]
    public async Task GetTimeReportAsync_MultipleTasks_ShouldCalculateGrandTotal()
    {
        // Arrange
        var db = GetDbContext();
        db.WorkLogs.AddRange(
            new WorkLog { TaskItemId = 1, UserId = 1, Hours = 10m },
            new WorkLog { TaskItemId = 2, UserId = 1, Hours = 5m }
        );
        db.Tasks.AddRange(
            new TaskItem { Id = 1, Title = "T1", CreatedById = 1 },
            new TaskItem { Id = 2, Title = "T2", CreatedById = 1 }
        );
        await db.SaveChangesAsync();

        var service = new ReportService(db);

        // Act
        var report = await service.GetTimeReportAsync();

        // Assert
        report.GrandTotalHours.Should().Be(15.0m);
    }
}
