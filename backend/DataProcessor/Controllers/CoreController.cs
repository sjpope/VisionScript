using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using DataProcessor.Models;
using DataProcessor.Services;

namespace DataProcessor.Controllers
{
    
    [ApiController]
    [Microsoft.AspNetCore.Mvc.Route("[controller]")]
    public class CoreController : ControllerBase
    {
        private readonly ILogger<CoreController> _logger;
        private readonly DataProcessor.Services.ProcessingService _dataProcessor;

        public CoreController(ILogger<CoreController> logger, ProcessingService dataProcessor)
        {
            _logger = logger;
            _dataProcessor = dataProcessor;
        }

        [HttpPost("process")]
        public IActionResult ProcessData([FromBody] List<EyeData> sessionData)
        {
            if (sessionData == null || sessionData.Count == 0)
                return BadRequest("Session data is empty.");

            Console.WriteLine("Oh brother...");

            try
            {
                ProcessResult result = _dataProcessor.ProcessData(sessionData);
                return Ok(result);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                return BadRequest("An error occurred while processing the data.");
            }
            
        }
    }
}