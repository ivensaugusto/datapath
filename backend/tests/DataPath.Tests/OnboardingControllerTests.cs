using System.Security.Claims;
using DataPath.Api.Controllers;
using DataPath.Core.DTOs;
using DataPath.Core.Entities;
using DataPath.Core.Enums;
using DataPath.Core.Interfaces;
using DataPath.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace DataPath.Tests;

public class OnboardingControllerTests
{
    private DataPathDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<DataPathDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new DataPathDbContext(options);
    }

    [Fact]
    public async Task ApproveRequest_WhenValid_ReturnsOkAndCreatesEntities()
    {
        var db = GetInMemoryDbContext();
        var storageMock = new Mock<IStorageProvider>();
        var authMock = new Mock<IAuthService>();
        var loggerMock = new Mock<ILogger<OnboardingController>>();

        authMock.Setup(a => a.HashPassword(It.IsAny<string>())).Returns(""hashed_password"");

        var controller = new OnboardingController(db, storageMock.Object, authMock.Object, loggerMock.Object);

        var userId = Guid.NewGuid();
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
        var identity = new ClaimsIdentity(claims, ""TestAuthType"");
        var claimsPrincipal = new ClaimsPrincipal(identity);
        controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = claimsPrincipal } };

        var request = new EquipmentAccessRequest
        {
            Id = Guid.NewGuid(),
            Email = ""test@test.com"",
            FullName = ""Test User"",
            Status = EquipmentRequestStatus.Pending,
            RequestedStoragePolicy = StoragePolicyType.PrivateTemporary,
            ResearchTitle = ""Test Research""
        };
        db.EquipmentAccessRequests.Add(request);
        await db.SaveChangesAsync();

        var dto = new ApproveOnboardingRequestDto
        {
            InstitutionType = InstitutionType.PublicUniversity,
            ExpectedSlidesCount = 50,
            AssignedUserRole = UserRole.Operator,
            ReviewNotes = ""Approved for testing""
        };

        var result = await controller.ApproveRequest(request.Id, dto);

        Assert.IsType<OkObjectResult>(result);
        
        var updatedReq = await db.EquipmentAccessRequests.FindAsync(request.Id);
        Assert.Equal(EquipmentRequestStatus.Approved, updatedReq!.Status);
        
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == ""test@test.com"");
        Assert.NotNull(user);
        
        var order = await db.DigitizationOrders.FirstOrDefaultAsync(o => o.EquipmentAccessRequestId == request.Id);
        Assert.NotNull(order);
    }
}
