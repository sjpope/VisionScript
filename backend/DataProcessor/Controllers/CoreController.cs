using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using DataProcessor.Models;
using DataProcessor.Services;
using System.Text.Json.Serialization;
using System.Net.Http.Json;
using Newtonsoft.Json;

// cd OneDrive\Documents\TXST\IND. STUDY\Repos\VisionScript\backend\DataProcessor
// curl -X POST "http://localhost:5080/Core/process" -H "Content-Type: application/json" -d @"C:\Users\sampo\OneDrive\Documents\TXST\IND. STUDY\Repos\VisionScript\backend\data\raw\session-1731834403808.json"
// C:\Users\sampo\OneDrive\Documents\TXST\IND. STUDY\Repos\VisionScript\backend\data\raw\session-1731834403808.json
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

            Console.WriteLine($"\n\nWE'VE GOT DATA.\n{sessionData.data.Count} items in session data. Session ID: {sessionData.sessionId} Task ID: {sessionData.task}\n");
            Console.WriteLine(JsonConvert.SerializeObject(sessionData.data.First()));
            
            try
            {
                string path = Path.Combine("C:/Users/sampo/OneDrive/Documents/TXST/IND. STUDY/Repos/VisionScript/backend/data/raw", $"session-{sessionData.sessionId}.json");
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(sessionData));
                
                ProcessResult result = _dataProcessor.ProcessData(sessionData.data);

                path = Path.Combine("C:/Users/sampo/OneDrive/Documents/TXST/IND. STUDY/Repos/VisionScript/backend/data/processed", $"session-{sessionData.sessionId}-processed.json");
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(result));

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