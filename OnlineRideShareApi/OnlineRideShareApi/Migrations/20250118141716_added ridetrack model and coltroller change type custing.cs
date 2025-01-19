using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineRideShareApi.Migrations
{
    /// <inheritdoc />
    public partial class addedridetrackmodelandcoltrollerchangetypecusting : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RideBooks_DriverVehicles_DriverVehicleId",
                table: "RideBooks");

            migrationBuilder.AlterColumn<int>(
                name: "DriverVehicleId",
                table: "RideBooks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "DriverRating",
                table: "RideBooks",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "CustomerRating",
                table: "RideBooks",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RideBooks_DriverVehicles_DriverVehicleId",
                table: "RideBooks",
                column: "DriverVehicleId",
                principalTable: "DriverVehicles",
                principalColumn: "DriverVehicleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RideBooks_DriverVehicles_DriverVehicleId",
                table: "RideBooks");

            migrationBuilder.AlterColumn<int>(
                name: "DriverVehicleId",
                table: "RideBooks",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DriverRating",
                table: "RideBooks",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerRating",
                table: "RideBooks",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RideBooks_DriverVehicles_DriverVehicleId",
                table: "RideBooks",
                column: "DriverVehicleId",
                principalTable: "DriverVehicles",
                principalColumn: "DriverVehicleId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
