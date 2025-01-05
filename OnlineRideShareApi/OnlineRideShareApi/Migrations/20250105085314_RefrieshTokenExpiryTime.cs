using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineRideShareApi.Migrations
{
    /// <inheritdoc />
    public partial class RefrieshTokenExpiryTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RefrieshTokenTime",
                table: "AspNetUsers",
                newName: "RefrieshTokenExpiryTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RefrieshTokenExpiryTime",
                table: "AspNetUsers",
                newName: "RefrieshTokenTime");
        }
    }
}
