using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntermediarySearchService.Infrastructure.Data.Migrations
{
    public partial class NewPropertiesToOrderAndOffer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TrackCode",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isBuyingByMyself",
                table: "Orders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "StateOffer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    State = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OwnerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StateOffer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StateOffer_Offers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Offers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StateOffer_OwnerId",
                table: "StateOffer",
                column: "OwnerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StateOffer");

            migrationBuilder.DropColumn(
                name: "TrackCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "isBuyingByMyself",
                table: "Orders");
        }
    }
}
