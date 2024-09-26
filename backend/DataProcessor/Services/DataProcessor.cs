using DataProcessor.Models;

namespace DataProcessor.Services
{
    public class ProcessingService
    {
        // TO-DO: Implement Data Processing Logic
        public ProcessResult ProcessData(List<EyeData> sessionData)
        {
            ProcessResult res = new ProcessResult();

            List<EyeData> window = new List<EyeData>();

            List<Fixation> fixations = new List<Fixation>();
            List<Saccade> saccades = new List<Saccade>();

            double dispersionThreshold = 75; // Pixels -> Maximum dispersion/distance between points to consider a fixation
            double minFixation = 100; // ms

            double start = sessionData[0].Timestamp, end = 0;

            /*
            {"x":463.4866564651469,"y":168.66635159193666,"timestamp":100820.19999998808},
            {"x":371.64037621748116,"y":159.9519054142047,"timestamp":100967.30000001192}]
            */
            foreach (var point in sessionData)
            {
                // Calculate dispersion of the window
                var dispersion = CalculateDispersion(window);
                window.Add(point);

                if (dispersion < dispersionThreshold)
                {
                    // it's a potential fixation
                    end = point.Timestamp;
                }
                else
                {
                    if (window.Count >= minFixation)
                    {
                        fixations.Add(new Fixation()
                        {
                            StartTime = start,
                            EndTime = end,
                            Duration = end - start,
                            X = window.Average(p => p.GazeX),
                            Y = window.Average(p => p.GazeY)
                        });
                    }

                    // start new window/group of points here
                    window.Clear();
                    window.Add(point);
                    start = point.Timestamp;
                    end = point.Timestamp;
                }

            }

            Console.WriteLine("\nFixation Count: " + fixations.Count);

            // Handle the last cluster of points if the time range was long enough
            if (window.Count > 0)
            {
                double duration = end - start;

                if (duration >= minFixation)
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

            // Calculate Metrics
            Metrics metrics = new Metrics();
            metrics.TotalFixationDuration = fixations.Sum(f => f.Duration);
            metrics.AverageFixationDuration = fixations.Average(f => f.Duration);
            metrics.FixationCount = fixations.Count;
            metrics.TotalSaccadeAmplitude = saccades.Sum(s => s.Amplitude);
            metrics.AverageSaccadeAmplitude = saccades.Average(s => s.Amplitude);

            // Estimate cognitive load based on metrics
            string cognitiveLoad = EstimateCognitiveLoad(metrics);

            // Prepare the ProcessResult to return
            res.Fixations = fixations;
            res.Saccades = saccades;
            res.Metrics = metrics;
            res.CognitiveLoad = cognitiveLoad;

            return res;
        }

        // Function to calculate dispersion of gaze points in the current window
        private double CalculateDispersion(List<EyeData> points)
        {
            if (points.Count == 0)
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

        // Function to estimate cognitive load based on metrics
        private string EstimateCognitiveLoad(Metrics metrics)
        {
            // Cognitive load can be estimated using fixation and saccade metrics
            if (metrics.AverageFixationDuration > 300 && metrics.AverageSaccadeAmplitude < 20)
            {
                return "High";
            }
            else if (metrics.AverageFixationDuration > 200 && metrics.AverageSaccadeAmplitude < 40)
            {
                return "Moderate";
            }
            else
            {
                return "Low";
            }
        }

         
    }
}
