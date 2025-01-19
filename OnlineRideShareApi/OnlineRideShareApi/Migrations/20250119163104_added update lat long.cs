using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineRideShareApi.Migrations
{
    /// <inheritdoc />
    public partial class addedupdatelatlong : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DestinationLocation",
                table: "RideBooks");

            migrationBuilder.DropColumn(
                name: "SourceLocation",
                table: "RideBooks");

            migrationBuilder.AddColumn<float>(
                name: "DestinationLatitude",
                table: "RideBooks",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "DestinationLongitude",
                table: "RideBooks",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "SourceLatitude",
                table: "RideBooks",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "SourceLongitude",
                table: "RideBooks",
                type: "real",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DestinationLatitude",
                table: "RideBooks");

            migrationBuilder.DropColumn(
                name: "DestinationLongitude",
                table: "RideBooks");

            migrationBuilder.DropColumn(
                name: "SourceLatitude",
                table: "RideBooks");

            migrationBuilder.DropColumn(
                name: "SourceLongitude",
                table: "RideBooks");

            migrationBuilder.AddColumn<string>(
                name: "DestinationLocation",
                table: "RideBooks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SourceLocation",
                table: "RideBooks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
