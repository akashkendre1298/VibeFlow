using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VibeFlow.API.Services;

namespace VibeFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("time")]
    public async Task<IActionResult> GetTimeReport()
    {
        var report = await _reportService.GetTimeReportAsync();
        return Ok(report);
    }
}
