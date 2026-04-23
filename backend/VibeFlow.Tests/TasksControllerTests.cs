using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;
using VibeFlow.API.Controllers;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using VibeFlow.API.Services;
using Xunit;

namespace VibeFlow.Tests;

public class TasksControllerTests
{
    private VibeFlowDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<VibeFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new VibeFlowDbContext(options);
    }

    private TasksController GetController(VibeFlowDbContext db, ITaskService service)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, "1"),
        }, "mock"));

        var controller = new TasksController(db, service);
        controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
        return controller;
    }

    [Fact]
    public async Task CreateTask_ShouldReturnBadRequest_WhenTitleTooLong()
    {
        // Arrange
        var db = GetDbContext();
        var mockService = new Mock<ITaskService>();
        var controller = GetController(db, mockService.Object);
        
        var longTitle = new string('A', 256);
        var request = new CreateTaskRequest(longTitle, VibeFlow.API.Models.TaskStatus.Backlog);

        // Act
        var result = await controller.CreateTask(request);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task UpdateTask_ShouldReturnNotFound_WhenTaskDoesNotExist()
    {
        // Arrange
        var db = GetDbContext();
        var mockService = new Mock<ITaskService>();
        var controller = GetController(db, mockService.Object);
        var request = new UpdateTaskRequest(null, null, null, null, null, null, null, null);

        // Act
        var result = await controller.UpdateTask(999, request);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }
}
