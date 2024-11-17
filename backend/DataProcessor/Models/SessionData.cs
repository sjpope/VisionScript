
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace DataProcessor.Models;

public class SessionData
{

    [JsonPropertyName("sessionId")]
    public long sessionId { get; set; }

    [JsonPropertyName("task")]
    public string task { get; set; } = "";
    
    [Required]
    [JsonPropertyName("data")]
    public List<EyeData> data { get; set; }
}