using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineRideShareApi.Migrations
{
    /// <inheritdoc />
    public partial class addedridetrackmodelandcoltroller : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RideTracks",
                columns: table => new
                {
                    RideTrackId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RideBookId = table.Column<int>(type: "int", nullable: false),
                    RideTrackLatitude = table.Column<float>(type: "real", nullable: false),
                    RideTrackLongitude = table.Column<float>(type: "real", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Distance = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RideTracks", x => x.RideTrackId);
                    table.ForeignKey(
                        name: "FK_RideTracks_RideBooks_RideBookId",
                        column: x => x.RideBookId,
                        principalTable: "RideBooks",
                        principalColumn: "RideBookId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RideTracks_RideBookId",
                table: "RideTracks",
                column: "RideBookId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RideTracks");
        }
    }
}
