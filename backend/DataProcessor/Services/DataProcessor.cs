using DataProcessor.Models;
// curl -X POST "http://localhost:5080/Core/process" -H "Content-Type: application/json" -d @"C:\Users\sampo\OneDrive\Documents\TXST\IND. STUDY\Repos\VisionScript\session-2.json"

namespace DataProcessor.Services
{
    public class ProcessingService
    {
        // TO-DO: Implement Data Processing Logic
        public ProcessResult ProcessData(List<EyeData> data)
        {
            ProcessResult res = new ProcessResult();
            List<EyeData> window = new List<EyeData>();
            List<Fixation> fixations = new List<Fixation>();
            List<Saccade> saccades = new List<Saccade>();

            double maxPixelDispersion = 250; // Pixels -> Maximum dispersion/distance between points to consider a fixation     // (75 to 100 to 150 to 200 to 250)
            double minFixationDuration = 50; // ms -> Minimum duration to consider a fixation           // (350 to 200 to 50)

            double start = data.First().Timestamp,    end = 0;
            int ct = 0;
            EyeData? prevPoint = null;
            
            foreach (EyeData point in data)
            {
                // Start a new fixation if time between points is too long
                // if (window.Count > 0 && (point.Timestamp - window.Last().Timestamp) > minFixationDuration)
                //     window.Clear();

                window.Add(point);
                double dispersion = CalculateDispersion(window);

                // if (ct <= 10 || ct >= data.Count - 10)
                //     Console.WriteLine($"LOG: Point {ct++}: {point.Timestamp} ms ---- Dispersion: {dispersion}\n\n");

                if (dispersion <= maxPixelDispersion) // Points are close enough to be considered part of the same fixation
                    end = point.Timestamp; 
                else
                {
                    if ((end - start) >= minFixationDuration) // Our current dispersion run is over but we have enough to record fixation
                    {
                        fixations.Add(new Fixation
                        {
                            StartTime = start,
                            EndTime = end,
                            Duration = end - start,
                            X = window.Average(p => p.GazeX),
                            Y = window.Average(p => p.GazeY)
                        });
                    }

                    // Reset the window with the current point as the start of a new potential fixation
                    window.Clear();
                    window.Add(point);
                    start = point.Timestamp;
                    end = point.Timestamp;
                }

                prevPoint = point; // Update the last processed point
            }

            Console.WriteLine("\nFixation Count: " + fixations.Count);

            // Handle the last cluster of points if the time range was long enough
            if (window.Count > 0)
            {
                double duration = end - start;

                if (duration >= minFixationDuration)
                    fixations.Add(new Fixation()
                    {
                        StartTime = start,
                        EndTime = end,
                        Duration = duration,
                        X = window.Average(p => p.GazeX),
                        Y = window.Average(p => p.GazeY)
                    });
            }

            // Calculate Saccades between consecutive fixations
            for (int i = 1; i < fixations.Count; i++)
            {
                try
                {
                    var prevFix = fixations[i - 1];
                    var currFix = fixations[i];
    
                    // Calculate saccade between fixations
                    double saccadeDistance = Math.Sqrt(Math.Pow(currFix.X - prevFix.X, 2) + Math.Pow(currFix.Y - prevFix.Y, 2));
                    double saccadeDuration = currFix.StartTime - prevFix.EndTime;
    
                    saccades.Add(new Saccade()
                    {
                        StartTime = prevFix.EndTime,
                        EndTime = currFix.StartTime,
                        Amplitude = saccadeDistance,
                        Duration = saccadeDuration
                    });
                }
                catch (System.Exception ex)
                {
                    Console.WriteLine("Error occurred while calculating saccades:" + ex.Message);  
                }
            }

            Console.WriteLine("Saccade Count: " + saccades.Count);  

            Metrics metrics = new Metrics();
            metrics.TotalFixationDuration = fixations.Sum(f => f.Duration);
            metrics.AverageFixationDuration = fixations.Average(f => f.Duration);
            metrics.FixationCount = fixations.Count;
            metrics.TotalSaccadeAmplitude = saccades.Sum(s => s.Amplitude);
            metrics.AverageSaccadeAmplitude = saccades.Average(s => s.Amplitude);

            string cognitiveLoad = EstimateCognitiveLoad(metrics);

            res.Fixations = fixations;
            res.Saccades = saccades;
            res.Metrics = metrics;
            res.CognitiveLoad = cognitiveLoad;

            Console.WriteLine($"\nRESULTS ARE IN:\n\nAverage Fixation Duration: {metrics.AverageFixationDuration} ms ---- Average Saccade Amplitude: {metrics.AverageSaccadeAmplitude} px");
            Console.WriteLine("Cognitive Load: " + cognitiveLoad);
            return res;
        }

        private double CalculateDispersion(List<EyeData> points)
        {
            if (points.Count < 2)
                return 0;

            try
            {
                double maxX = points.Max(p => p.GazeX);
                double minX = points.Min(p => p.GazeX);
                double maxY = points.Max(p => p.GazeY);
                double minY = points.Min(p => p.GazeY);
    
                double dispersion = Math.Sqrt(Math.Pow(maxX - minX, 2) + Math.Pow(maxY - minY, 2));
                // Calculate the Euclidean distance between the farthest points
                return dispersion;
            }
            catch (System.Exception ex)
            {
                Console.WriteLine("Error occurred while calculating dispersion:" + ex.Message);
                return 0;
            
            }
        }

        private string EstimateCognitiveLoad(Metrics metrics)
        {
            // Cognitive load can be estimated using fixation and saccade metrics

            // 549, 230 
            // 337, 387
            if (metrics.AverageFixationDuration > 800 && metrics.AverageSaccadeAmplitude < 190)
            {
                return "High";
            }
            else if (metrics.AverageFixationDuration > 650 && metrics.AverageSaccadeAmplitude < 220)
            {
                return "Moderate";
            }
            else
            {
                // Fixation Duration avg was less than 200 ms meaning the user was not focused on any point for long
                return "Low";
            }
        }

         
    }
}
