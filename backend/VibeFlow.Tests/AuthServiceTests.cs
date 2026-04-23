using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.Extensions.Configuration;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using VibeFlow.API.Services;
using Xunit;

namespace VibeFlow.Tests;

public class AuthServiceTests
{
    private VibeFlowDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<VibeFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new VibeFlowDbContext(options);
    }

    [Fact]
    public async Task RegisterAsync_ShouldHashPassword()
    {
        // Arrange
        var db = GetDbContext();
        var mockConfig = new Mock<IConfiguration>();
        var service = new AuthService(db, mockConfig.Object);
        var password = "PlainPassword123";

        // Act
        var user = await service.RegisterAsync("test@test.com", password, "Test Person");

        // Assert
        user.PasswordHash.Should().NotBe(password);
        BCrypt.Net.BCrypt.Verify(password, user.PasswordHash).Should().BeTrue();
    }

    [Fact]
    public async Task LoginAsync_WithWrongPassword_ShouldReturnNull()
    {
        // Arrange
        var db = GetDbContext();
        var mockConfig = new Mock<IConfiguration>();
        var service = new AuthService(db, mockConfig.Object);
        await service.RegisterAsync("test@test.com", "correct", "Test");

        // Act
        var result = await service.LoginAsync("test@test.com", "wrong");

        // Assert
        result.Should().BeNull();
    }
}
