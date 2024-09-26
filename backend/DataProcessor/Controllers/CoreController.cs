using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using DataProcessor.Models;
using DataProcessor.Services;
using System.Text.Json.Serialization;
using System.Net.Http.Json;
using Newtonsoft.Json;

// curl -X POST "http://localhost:5080/Core/process" -H "Content-Type: application/json" -d @"C:\Users\sampo\OneDrive\Documents\TXST\IND. STUDY\Repos\VisionScript\session-2.json"

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
            Console.WriteLine(sessionData.Count + " items in session data.");
            Console.WriteLine(JsonConvert.SerializeObject(sessionData.First()));

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