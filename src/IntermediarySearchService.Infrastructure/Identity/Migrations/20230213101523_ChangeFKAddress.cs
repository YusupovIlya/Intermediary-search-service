using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntermediarySearchService.Infrastructure.Identity.Migrations
{
    public partial class ChangeFKAddress : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Users_UserName",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Addresses",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_UserName",
                table: "Addresses",
                newName: "IX_Addresses_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Users_UserId",
                table: "Addresses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Users_UserId",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Addresses",
                newName: "UserName");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_UserId",
                table: "Addresses",
                newName: "IX_Addresses_UserName");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Users_UserName",
                table: "Addresses",
                column: "UserName",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
