using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VibeFlow.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDueDateHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "NewDueDate",
                table: "AssignmentHistories",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OldDueDate",
                table: "AssignmentHistories",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewDueDate",
                table: "AssignmentHistories");

            migrationBuilder.DropColumn(
                name: "OldDueDate",
                table: "AssignmentHistories");
        }
    }
}
