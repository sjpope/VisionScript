import json
import os
import argparse
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import numpy as np

# C:\Users\sampo\OneDrive\Documents\TXST\IND. STUDY\Repos\VisionScript
# python plot.py --sessionId 1734199526648 --task development
def main():
    parser = argparse.ArgumentParser(description='Generate charts and metrics from session JSON data.')
    parser.add_argument('--sessionId', required=True, help='Session ID of the processed session.')
    parser.add_argument('--task', required=False, help='Task name (e.g., development, debugging, code_review).')
    args = parser.parse_args()

    session_id = args.sessionId
    task = default_task = args.task or "development"

    # Directories
    input_dir = r"C:/Users/sampo/OneDrive/Documents/TXST/IND. STUDY/Repos/VisionScript\backend\data/processed"
    output_dir = r"C:/Users\sampo/OneDrive\Documents/TXST/IND. STUDY/Figures"

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Input file with the new format
    input_file = os.path.join(input_dir, f"session-{session_id}-processed.json")

    if not os.path.isfile(input_file):
        print(f"Error: Input file {input_file} does not exist. Trying task format...")
        input_file = os.path.join(input_dir, f"session-{session_id}-{task}-processed.json")
        
        if not os.path.isfile(input_file):
            print(f"Error: Input file {input_file} does not exist. Exiting...")
            return

    with open(input_file, 'r') as f:
        data = json.load(f)

    fixations = data.get("fixations", [])
    saccades = data.get("saccades", [])
    metrics = data.get("metrics", {})
    cognitive_load = data.get("cognitiveLoad", "Unknown")

    fix_df = pd.DataFrame(fixations)
    sac_df = pd.DataFrame(saccades)

    # Ensure required columns exist
    for col in ["StartTime", "Duration", "X", "Y"]:
        if col not in fix_df.columns:
            fix_df[col] = np.nan
    for col in ["StartTime", "Amplitude"]:
        if col not in sac_df.columns:
            sac_df[col] = np.nan

    # Convert time from ms to seconds for better scaling
    fix_df['Time_s'] = fix_df['StartTime'] / 1000.0
    sac_df['Time_s'] = sac_df['StartTime'] / 1000.0

    # 1. Fixation Duration Over Time (in seconds)
    plt.figure(figsize=(12, 6))
    plt.plot(fix_df['Time_s'], fix_df['Duration'], marker='o', linestyle='-', ms=2)
    plt.title(f"Fixation Duration Over Time (Session {session_id}, Task: {task})")
    plt.xlabel("Time (s)")  # seconds now
    plt.ylabel("Fixation Duration (ms)")
    plt.grid(True)
    # Consider setting a y-limit if extremely large durations skew the plot:
    plt.ylim(0, fix_df['Duration'].quantile(0.99)) # for example
    fixation_chart_file = os.path.join(output_dir, f"session-{session_id}-{task}-fixation-duration.png")
    plt.savefig(fixation_chart_file, dpi=300)
    plt.close()

    # 2. Saccade Amplitude Over Time (in seconds)
    plt.figure(figsize=(12, 6))
    plt.plot(sac_df['Time_s'], sac_df['Amplitude'], marker='o', linestyle='-', ms=2, color='red')
    plt.title(f"Saccade Amplitude Over Time (Session {session_id}, Task: {task})")
    plt.xlabel("Time (s)")
    plt.ylabel("Saccade Amplitude (pixels)")
    plt.grid(True)
    # Consider y-limits or log scale if amplitude is too large
    # plt.ylim(0, sac_df['Amplitude'].quantile(0.99))
    saccade_chart_file = os.path.join(output_dir, f"session-{session_id}-{task}-saccade-amplitude.png")
    plt.savefig(saccade_chart_file, dpi=300)
    plt.close()

    # 3. Fixation Scatter Plot (X vs Y)
    # Large coordinate ranges might need normalization or limits
    plt.figure(figsize=(8, 6))
    plt.scatter(fix_df['X'], fix_df['Y'], s=5, c='blue', alpha=0.6)
    plt.title(f"Fixation Points (Session {session_id}, Task: {task})")
    plt.xlabel("X Coordinate (pixels)")
    plt.ylabel("Y Coordinate (pixels)")
    plt.grid(True)
    # If needed, set axis limits or invert y-axis depending on screen coordinate system:
    # plt.gca().invert_yaxis()
    scatter_chart_file = os.path.join(output_dir, f"session-{session_id}-{task}-fixation-scatter.png")
    plt.savefig(scatter_chart_file, dpi=300)
    plt.close()

    # 4. Improved Heatmap of Fixation Points
    # Instead of a raw histogram, use a KDE plot for smoother visualization
    if not fix_df.empty:
        plt.figure(figsize=(8, 6))
        # Use seaborn's kdeplot to produce a density estimation of fixations
        sns.kdeplot(x=fix_df['X'], y=fix_df['Y'], cmap='Reds', shade=True, thresh=0.05)
        plt.title(f"Fixation Density (Session {session_id}, Task: {task})")
        plt.xlabel("X Coordinate (pixels)")
        plt.ylabel("Y Coordinate (pixels)")
        plt.grid(True)
        heatmap_file = os.path.join(output_dir, f"session-{session_id}-{task}-fixation-density.png")
        plt.savefig(heatmap_file, dpi=300)
        plt.close()
    else:
        heatmap_file = "No fixation data available, no heatmap generated."

    # # 5. Export metrics as CSV
    # metrics_file = os.path.join(output_dir, f"session-{session_id}-{task}-metrics.csv")
    # metrics_df = pd.DataFrame([metrics])
    # metrics_df['sessionId'] = session_id
    # metrics_df['task'] = task
    # metrics_df['cognitiveLoad'] = cognitive_load
    # metrics_df.to_csv(metrics_file, index=False)

    print("Charts and metrics exported successfully!")
    print(f"- {fixation_chart_file}")
    print(f"- {saccade_chart_file}")
    print(f"- {scatter_chart_file}")
    if isinstance(heatmap_file, str) and "No fixation data" in heatmap_file:
        print(f"- {heatmap_file}")
    else:
        print(f"- {heatmap_file}")
    # print(f"- {metrics_file}")

if __name__ == "__main__":
    main()
