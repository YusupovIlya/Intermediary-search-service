using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntermediarySearchService.Infrastructure.Data.Migrations
{
    public partial class CommentPropertyToOffer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Offers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Offers");
        }
    }
}
