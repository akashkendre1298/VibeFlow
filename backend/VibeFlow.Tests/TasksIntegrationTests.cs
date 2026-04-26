using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;
using VibeFlow.API.Controllers;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using TaskStatus = VibeFlow.API.Models.TaskStatus;

namespace VibeFlow.Tests.IntegrationTests;

public class TasksIntegrationTests : IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:15-alpine")
        .WithDatabase("vibeflow_test")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    private WebApplicationFactory<Program> _factory = null!;
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();

        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<VibeFlowDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<VibeFlowDbContext>(options =>
                {
                    options.UseNpgsql(_dbContainer.GetConnectionString());
                });
            });
        });

        _client = _factory.CreateClient();

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<VibeFlowDbContext>();
        await db.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _dbContainer.DisposeAsync();
    }

    [Fact]
    public async Task CompleteWorkflow_Login_CreateTask_Assign_LogWork()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<VibeFlowDbContext>();
        
        var user = new User { Name = "Int User", Email = "int@test.com", PasswordHash = "dummy" };
        var authService = scope.ServiceProvider.GetRequiredService<VibeFlow.API.Services.IAuthService>();
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var token = authService.GenerateJwtToken(user);
        
        _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        // Create Task
        var createReq = new CreateTaskRequest("Integration Task", TaskStatus.Backlog, "Desc", TaskPriority.Medium, null, null);
        var resCreate = await _client.PostAsJsonAsync("/api/tasks", createReq);
        resCreate.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var taskContent = await resCreate.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(taskContent);
        var taskId = jsonDoc.RootElement.GetProperty("id").GetInt32();

        // Assign Task
        var updateReq = new UpdateTaskRequest(null, null, null, user.Id, false, null, null, null);
        var resUpdate = await _client.PatchAsJsonAsync($"/api/tasks/{taskId}", updateReq);
        resUpdate.StatusCode.Should().Be(HttpStatusCode.OK);

        // Log Work
        var logReq = new LogWorkRequest(2.5m, "Did some integration");
        var resLog = await _client.PostAsJsonAsync($"/api/tasks/{taskId}/worklogs", logReq);
        resLog.StatusCode.Should().Be(HttpStatusCode.OK);

        // Verify History & Worklogs
        var resHistory = await _client.GetAsync($"/api/tasks/{taskId}/history");
        resHistory.StatusCode.Should().Be(HttpStatusCode.OK);
        var historyContent = await resHistory.Content.ReadAsStringAsync();
        historyContent.Should().Contain(user.Name);

        var resGetLogs = await _client.GetAsync($"/api/tasks/{taskId}/worklogs");
        resGetLogs.StatusCode.Should().Be(HttpStatusCode.OK);
        var getLogsContent = await resGetLogs.Content.ReadAsStringAsync();
        getLogsContent.Should().Contain("2.5");
    }
}
