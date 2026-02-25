using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_CommerceApi.Migrations
{
    /// <inheritdoc />
    public partial class driverCanCanceled : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CancelReason",
                table: "Shippings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancelReason",
                table: "Shippings");
        }
    }
}
