using DataProcessor.Models;

namespace DataProcessor.Services
{
    public class DataProcessor
    {
        // TO-DO: Implement Data Processing Logic
        public ProcessResult ProcessData(List<EyeData> sessionData)
        {
            ProcessResult res = new ProcessResult();

            List<EyeData> window = new List<EyeData>();

            List<Fixation> fixations = new List<Fixation>();
            List<Saccade> saccades = new List<Saccade>();

            double threshold = 50; // Pixels
            double minFixation = 100; // ms

            double start = sessionData[0].TimeStamp, end = 0;

            /*
            {"x":463.4866564651469,"y":168.66635159193666,"timestamp":100820.19999998808},
            {"x":371.64037621748116,"y":159.9519054142047,"timestamp":100967.30000001192}]
            */
            foreach (var point in sessionData)
            {
                // Calculate dispersion of the window
                var dispersion = CalculateDispersion(window);

                    if (dispersion < threshold){
                        // it's a potential fixation
                        end = point.TimeStamp;

                    }
                    else{
                        if (window.Count >= minFixation){
                            Fixation fx = new Fixation()
                            {
                                StartTime = start,
                                EndTime = end,
                                Duration = end - start,
                                X = window.Average(p => p.GazeX),
                                Y = window.Average(p => p.GazeY)
                            };
                            fixations.Add(fx);
                        }

                        // start new window/group of points here
                        window.Clear();
                    }
                    // IF: dispersion is low (set some default threshold), 
                        // it's a potential fixation

                    // ELSE: If dispersion is too high (set some default threshold), 
                        // check if duration (of window) is >= minFixation

                            // Record fixation
                            
            
                
            // Handle the last cluster of points
            if (window.Count > 0)
            {
                var duration = endTime.Value - startTime.Value;
                if (duration >= minimumFixationDuration)
                {
                    var fixation = new Fixation
                    {
                        StartTime = startTime.Value,
                        EndTime = endTime.Value,
                        Duration = duration,
                        X = window.Average(p => p.x),
                        Y = window.Average(p => p.y)
                    };
                    fixations.Add(fixation);
                }
            }

            // CALCULATE SACCADES BETWEEN FIXATIONS
            // foreach (var fixation in fixations)
                // Create new Saccade() and add to saccades list


            // CALCULATE METRICS HERE
            // metrics.TotalFixationDuration = fixations.Sum(f => f.Duration);
            // metrics.AverageFixationDuration = fixations.Average(f => f.Duration);
            // metrics.FixationCount = fixations.Count;
            // metrics.TotalSaccadeAmplitude = saccades.Sum(s => s.Amplitude);
            // metrics.AverageSaccadeAmplitude = saccades.Average(s => s.Amplitude);


            // res.Fixations = fixations;
            // res.Saccades = saccades;
            // res.Metrics = metrics;
            // res.CognitiveLoad = EstimateCognitiveLoad(metrics);


            return new ProcessResult();
        }

        private double CalculateDispersion(List<EyeData> points)
        {
            // Calculate the dispersion of the window
            // TO-DO: Implement dispersion calculation
            return 0;
        }

        // private string EstimateCognitiveLoad(Metrics metrics)

        // private List<Fixation> ExtractFixations(List<EyeDataPoint> points)   
    }
}
