
using System.ComponentModel.DataAnnotations;

namespace DataProcessor.Models;

public class SessionData
{
    public long sessionId { get; set; }

    public string taskId { get; set; } = "";
    
    [Required]
    public List<EyeData> data { get; set; }
}