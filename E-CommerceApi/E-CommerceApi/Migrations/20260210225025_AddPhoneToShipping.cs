using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_CommerceApi.Migrations
{
    /// <inheritdoc />
    public partial class AddPhoneToShipping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DriverId",
                table: "Shippings",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiverPhoneNumber",
                table: "Shippings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Shippings_DriverId",
                table: "Shippings",
                column: "DriverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Shippings_AspNetUsers_DriverId",
                table: "Shippings",
                column: "DriverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shippings_AspNetUsers_DriverId",
                table: "Shippings");

            migrationBuilder.DropIndex(
                name: "IX_Shippings_DriverId",
                table: "Shippings");

            migrationBuilder.DropColumn(
                name: "DriverId",
                table: "Shippings");

            migrationBuilder.DropColumn(
                name: "ReceiverPhoneNumber",
                table: "Shippings");
        }
    }
}
