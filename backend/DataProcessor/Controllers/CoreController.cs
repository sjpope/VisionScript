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
        public IActionResult ProcessData([FromBody] SessionData sessionData)
        {

            if (sessionData == null || sessionData.data.Count == 0)  return BadRequest("Session data is empty.");

            Console.WriteLine($"{sessionData.data.Count} items in session data. Session ID: {sessionData.sessionId} Task ID: {sessionData.task}");
            Console.WriteLine(JsonConvert.SerializeObject(sessionData.data.First()));
            
            try
            {
                // {"Id":0,"UserId":0,"SessionId":0,"Timestamp":0.0,"GazeX":500.2759796874867,"GazeY":500.3435009314155,"PupilDiameter":0.0}
                
                string path = Path.Combine("C:/Users/sampo/OneDrive/Documents/TXST/IND. STUDY/Repos/VisionScript/backend/data/raw", $"session-{sessionData.sessionId}.json");
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(sessionData));
                
                ProcessResult result = _dataProcessor.ProcessData(sessionData.data);
                return Ok(result);
            }
            catch (Exception e)
            {
                Console.WriteLine($"\nAn error occurred while processing the data.\nError Message: {e.Message}\nStack Trace {e.StackTrace}\n");

                return BadRequest("An error occurred while processing the data.");
            }
            
        }
    }
}