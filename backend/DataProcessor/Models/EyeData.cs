using System.Text.Json.Serialization;

namespace DataProcessor.Models
{
    public class EyeData
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long SessionId { get; set; }

        [JsonPropertyName("timestamp")]
        public double Timestamp { get; set; } // Is Time Elapsed (ms)
        [JsonPropertyName("x")]
        public double GazeX { get; set; }
        [JsonPropertyName("y")]
        public double GazeY { get; set; }
        
        public double PupilDiameter { get; set; }

        // From js, data could appear like so:

        // var data = {
        //     'positions' : [positions.x,positions.y],
        //     'width': pixelData.width,
        //     'x' : x,
        //     'y' : y,
        //     'type' : type,
        //     'timestamp' : (new Date()).getTime()
        // };

    }
}