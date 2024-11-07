
using System.ComponentModel.DataAnnotations;

namespace DataProcessor.Models;
public class SessionData
{
    public int sessionId { get; set; }
    
    [Required]
    public List<EyeData> data { get; set; }
}