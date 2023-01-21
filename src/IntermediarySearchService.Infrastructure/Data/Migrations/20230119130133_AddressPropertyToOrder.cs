using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntermediarySearchService.Infrastructure.Data.Migrations
{
    public partial class AddressPropertyToOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address_Country",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_Label",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address_PostalCode",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Address_Region",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address_Country",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Address_Label",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Address_PostalCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Address_Region",
                table: "Orders");
        }
    }
}
