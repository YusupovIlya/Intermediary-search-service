using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntermediarySearchService.Infrastructure.Identity.Migrations
{
    public partial class AddressChangeFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAddress_Users_ApplicationUserId",
                table: "UserAddress");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserAddress",
                table: "UserAddress");

            migrationBuilder.DropIndex(
                name: "IX_UserAddress_ApplicationUserId",
                table: "UserAddress");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "UserAddress");

            migrationBuilder.RenameTable(
                name: "UserAddress",
                newName: "Addresses");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "Addresses",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Addresses",
                table: "Addresses",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_UserName",
                table: "Addresses",
                column: "UserName");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Users_UserName",
                table: "Addresses",
                column: "UserName",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Users_UserName",
                table: "Addresses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Addresses",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_UserName",
                table: "Addresses");

            migrationBuilder.RenameTable(
                name: "Addresses",
                newName: "UserAddress");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "UserAddress",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "UserAddress",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserAddress",
                table: "UserAddress",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserAddress_ApplicationUserId",
                table: "UserAddress",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAddress_Users_ApplicationUserId",
                table: "UserAddress",
                column: "ApplicationUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
