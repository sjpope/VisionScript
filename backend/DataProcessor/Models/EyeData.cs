namespace DataProcessor.Models
{
    public class EyeData
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long SessionId { get; set; }
        public int TimeStamp { get; set; } // Is Time Elapsed (ms)
        public int GazeX { get; set; }
        public int GazeY { get; set; }
        public int PupilDiameter { get; set; }

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