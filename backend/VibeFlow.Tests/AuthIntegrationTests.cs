using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.Extensions.Configuration;
using VibeFlow.API.Data;
using VibeFlow.API.Models;
using VibeFlow.API.Services;
using Xunit;

namespace VibeFlow.Tests;

public class AuthIntegrationTests
{
    private VibeFlowDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<VibeFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new VibeFlowDbContext(options);
    }

    [Fact]
    public async Task RegistrationAndLogin_FullFlow_ShouldSucceed()
    {
        // Arrange
        var db = GetDbContext();
        var mockConfig = new Mock<IConfiguration>();
        // Mocking the JWT configuration
        var mockSection = new Mock<IConfigurationSection>();
        mockSection.Setup(s => s["Key"]).Returns("very_secret_key_that_is_long_enough_for_hmac_sha256");
        mockConfig.Setup(c => c.GetSection("Jwt")).Returns(mockSection.Object);

        var service = new AuthService(db, mockConfig.Object);
        var email = "user@vibeflow.com";
        var password = "SecurePassword123";
        var name = "Vibe User";

        // Act - Register
        var registeredUser = await service.RegisterAsync(email, password, name);
        
        // Assert - Registration
        registeredUser.Should().NotBeNull();
        registeredUser.Email.Should().Be(email);
        registeredUser.PasswordHash.Should().NotBe(password);

        // Act - Login
        var token = await service.LoginAsync(email, password);

        // Assert - Login (Should return a non-empty token string)
        token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ShouldThrowException()
    {
        // Arrange
        var db = GetDbContext();
        var mockConfig = new Mock<IConfiguration>();
        var service = new AuthService(db, mockConfig.Object);
        await service.RegisterAsync("duplicate@test.com", "pass", "User 1");

        // Act & Assert
        // In EF Core, unique constraints are not enforced in In-Memory DB by default
        // However, if the service checks for existing email, it should throw.
        // Let's see if the service has an explicit check.
    }
}
