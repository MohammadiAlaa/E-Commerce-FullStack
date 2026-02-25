using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_CommerceApi.Migrations
{
    /// <inheritdoc />
    public partial class More_Efficiency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "Orders",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceAtPurchase",
                table: "OrderItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Items",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPrice",
                table: "Items",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAvailable",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PriceAtPurchase",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "DiscountPrice",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "IsAvailable",
                table: "Items");
        }
    }
}
