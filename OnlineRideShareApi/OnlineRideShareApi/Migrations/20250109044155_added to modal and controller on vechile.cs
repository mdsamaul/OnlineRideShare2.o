using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineRideShareApi.Migrations
{
    /// <inheritdoc />
    public partial class addedtomodalandcontrolleronvechile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    VehicleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VehicleBrand = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleModel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleCapacity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleRegistrationNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleChassisNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VehicleLicence = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FitnessCertificateNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InsurancePolicyNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FitnessExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsuranceExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RegistrationValidityDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastMaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FuelType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OdometerReading = table.Column<int>(type: "int", nullable: true),
                    VehicleColor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EngineNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VehicleAge = table.Column<int>(type: "int", nullable: true),
                    LastServiceMileage = table.Column<int>(type: "int", nullable: true),
                    VehicleStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VehicleColorCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InsuranceProvider = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VehicleModelYear = table.Column<int>(type: "int", nullable: true),
                    IsAvailableForBooking = table.Column<bool>(type: "bit", nullable: true),
                    VehicleTypeId = table.Column<int>(type: "int", nullable: false),
                    CreateBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.VehicleId);
                    table.ForeignKey(
                        name: "FK_Vehicles_VehicleTypes_VehicleTypeId",
                        column: x => x.VehicleTypeId,
                        principalTable: "VehicleTypes",
                        principalColumn: "VehicleTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_VehicleTypeId",
                table: "Vehicles",
                column: "VehicleTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vehicles");
        }
    }
}
