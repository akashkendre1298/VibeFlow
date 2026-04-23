using Microsoft.EntityFrameworkCore;
using VibeFlow.API.Models;

namespace VibeFlow.API.Data;

public class VibeFlowDbContext : DbContext
{
    public VibeFlowDbContext(DbContextOptions<VibeFlowDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<WorkLog> WorkLogs => Set<WorkLog>();
    public DbSet<AssignmentHistory> AssignmentHistories => Set<AssignmentHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Assignee)
            .WithMany()
            .HasForeignKey(t => t.AssigneeId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.CreatedBy)
            .WithMany()
            .HasForeignKey(t => t.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AssignmentHistory>()
            .HasOne(h => h.OldAssignee)
            .WithMany()
            .HasForeignKey(h => h.OldAssigneeId);

        modelBuilder.Entity<AssignmentHistory>()
            .HasOne(h => h.NewAssignee)
            .WithMany()
            .HasForeignKey(h => h.NewAssigneeId);

        modelBuilder.Entity<AssignmentHistory>()
            .HasOne(h => h.ChangedBy)
            .WithMany()
            .HasForeignKey(h => h.ChangedById);
    }
}
