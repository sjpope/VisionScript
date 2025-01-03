using System.Collections.Generic;
using Newtonsoft.Json;

namespace DataProcessor.Models
{
    public class Fixation
    {
        public double StartTime { get; set; }
        public double EndTime { get; set; }
        public double Duration { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
    }

    public class Saccade
    {
        public double StartTime { get; set; }
        public double EndTime { get; set; }
        public double Duration { get; set; }
        public double StartX { get; set; }
        public double StartY { get; set; }
        public double EndX { get; set; }
        public double EndY { get; set; }
        public double Amplitude { get; set; }
    }

    public class Metrics
    {
        public double TotalFixationDuration { get; set; }
        public double AverageFixationDuration { get; set; }
        public int FixationCount { get; set; }
        public double TotalSaccadeAmplitude { get; set; }
        public double AverageSaccadeAmplitude { get; set; }
    }

    public class ProcessResult
    {
        [JsonProperty("fixations")]
        public List<Fixation> Fixations { get; set; } = new List<Fixation>();

        [JsonProperty("saccades")]
        public List<Saccade> Saccades { get; set; } = new List<Saccade>();

        [JsonProperty("metrics")]
        public Metrics Metrics { get; set; } = new Metrics();

        [JsonProperty("cognitiveLoad")]
        public string CognitiveLoad { get; set; } = "Unknown";
    }
}