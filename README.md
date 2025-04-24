INTERACTIVE VIDEO PROGRESS TRACKER:

This project is a web-based system designed "to track and store users video progress", especially for learning platforms. It supports both YouTube and custom-uploaded videos, records "real engagement", and helps users "resume from where they left off" — even after closing the browser.

--> Features

- "Real-time tracking" of watched video segments.
- Supports both "YouTube videos" and "custom uploaded videos".
- Progress is saved using "localStorage".
- Calculates "unique video segments" watched.
- Resume videos from the "exact last watched position".
- Reset functionality to clear progress and start over.
- Smart merging of overlapping watched time ranges.
- Visual "progress bar" with percentage watched.

-->Project Structure:
      Frontend:
          -index.html
          -script.js
          -style.css
      video:interactive video progress tracker(how the project will work)

-->How to run the project:
     -Open index.html in your browser.

      Interact:

        -Use the first two embedded YouTube players.(for testing the project how it works)

        -upload a custom .mp4 file.

        -Watch segments of the video.

        -Refresh and see your watch history persist.

 -->Testing:
 
        -Play and pause multiple times.

        -Skip around to test segment merging.

        -Try reloading the browser to see resume functionality.

        -Click Reset Progress to clear everything.

  -->Dependencies:
  
        -YouTube IFrame Player API

  -->How Watched Intervals Are Tracked:
  
      The system listens to the video player's timeupdate event and captures the current playback time at regular intervals (every 
      second). These timestamps are recorded as start and end pairs to create watched intervals, reflecting segments the user has 
      actually viewed.

 -->Merging Intervals to Get Unique Progress:
 
      To ensure skipping or repeated views don't inflate the progress, the intervals are merged:

      Overlapping or adjacent intervals are combined into a single one.

      This results in a list of unique non-overlapping intervals.

      The total watch time is calculated by summing the lengths of these intervals and comparing it to the total video duration.

  -->Challenges Faced & Solutions:
  
      Redundant Interval Tracking: Initially, intervals were overlapping due to frequent timeupdate events. To fix this, we sampled only 
      every second.

      Accurate Merging Logic: Merging intervals correctly was tricky, especially when there were many small segments. We implemented a 
      sort-then-merge approach to ensure accuracy.

     Persistent Progress: Tracking user progress across sessions would require backend support or local storage, which can be a future 
     enhancement.
 
