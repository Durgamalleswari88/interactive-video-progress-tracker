let player1, player2;
let interval1, interval2, interval3;
let currentRange1 = null, currentRange2 = null, currentRange3 = null;
let watchedRanges1 = JSON.parse(localStorage.getItem('watchedRanges1') || '[]');
let watchedRanges2 = JSON.parse(localStorage.getItem('watchedRanges2') || '[]');
let watchedRanges3 = JSON.parse(localStorage.getItem('watchedRanges3') || '[]');
let totalDuration1 = 0, totalDuration2 = 0, totalDuration3 = 0;
let lastPosition1 = parseFloat(localStorage.getItem('lastPosition1')) || 0;
let lastPosition2 = parseFloat(localStorage.getItem('lastPosition2')) || 0;
let lastPosition3 = parseFloat(localStorage.getItem('lastPosition3')) || 0;

function mergeRanges(ranges) {
  ranges.sort((a, b) => a.start - b.start);
  const merged = [];
  for (let range of ranges) {
    if (merged.length && merged[merged.length - 1].end >= range.start - 0.5) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

function calculateWatchedTime(ranges) {
  return ranges.reduce((sum, r) => sum + (r.end - r.start), 0);
}

function updateProgress(videoNumber) {
  const watchedRanges = videoNumber === 1 ? watchedRanges1 : 
                        videoNumber === 2 ? watchedRanges2 : 
                        watchedRanges3;

  const merged = mergeRanges(watchedRanges);
  const watchedTime = calculateWatchedTime(merged);
  const total = videoNumber === 1 ? totalDuration1 : 
                videoNumber === 2 ? totalDuration2 : 
                totalDuration3;

  const percent = total > 0 ? (watchedTime / total * 100).toFixed(2) : 0;

  document.getElementById(`progress${videoNumber}`).innerText = `${percent}%`;
  document.getElementById(`progress-fill${videoNumber}`).style.width = `${percent}%`;

  localStorage.setItem(`watchedRanges${videoNumber}`, JSON.stringify(merged));
}

function startTracking(videoNumber, currentTimeGetter, lastPositionKey, rangesArray, currentRangeObj, intervalVar) {
  clearInterval(intervalVar);
  currentRangeObj.start = currentTimeGetter();
  intervalVar = setInterval(() => {
    currentRangeObj.end = currentTimeGetter();
    rangesArray.push({ ...currentRangeObj });
    updateProgress(videoNumber);
    localStorage.setItem(lastPositionKey, currentRangeObj.end);
  }, 2000);
  return intervalVar;
}

function stopTracking(intervalVar) {
  clearInterval(intervalVar);
}

// YouTube API ready callback
function onYouTubeIframeAPIReady() {
  window.apiReady = true;
}

function loadPlayer(videoNumber) {
  if (!window.apiReady) {
    alert("Please wait for YouTube API to load.");
    return;
  }

  const videoId = videoNumber === 1 ? 'M7lc1UVf-VE' : 'w3jLJU7DT5E';
  const boxId = `video-box${videoNumber}`;

  const player = new YT.Player(boxId, {
    height: '360',
    width: '640',
    videoId,
    playerVars: { autoplay: 0 },
    events: {
      'onReady': (event) => {
        const duration = event.target.getDuration();
        if (videoNumber === 1) {
          totalDuration1 = duration;
          if (lastPosition1 > 0) event.target.seekTo(lastPosition1);
        } else {
          totalDuration2 = duration;
          if (lastPosition2 > 0) event.target.seekTo(lastPosition2);
        }
        updateProgress(videoNumber);
      },
      'onStateChange': (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          if (videoNumber === 1)
            interval1 = startTracking(1, () => player1.getCurrentTime(), 'lastPosition1', watchedRanges1, currentRange1 = {}, interval1);
          else
            interval2 = startTracking(2, () => player2.getCurrentTime(), 'lastPosition2', watchedRanges2, currentRange2 = {}, interval2);
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
          if (videoNumber === 1) stopTracking(interval1);
          else stopTracking(interval2);
        }
      }
    }
  });

  if (videoNumber === 1) player1 = player;
  else player2 = player;
}

document.getElementById('resetProgress1').addEventListener('click', () => {
  localStorage.removeItem('watchedRanges1');
  localStorage.removeItem('lastPosition1');
  watchedRanges1 = [];
  updateProgress(1);
  if (player1) player1.seekTo(0);
});

document.getElementById('resetProgress2').addEventListener('click', () => {
  localStorage.removeItem('watchedRanges2');
  localStorage.removeItem('lastPosition2');
  watchedRanges2 = [];
  updateProgress(2);
  if (player2) player2.seekTo(0);
});

const customVideo = document.getElementById('customVideo');

document.getElementById('uploadVideo').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    customVideo.src = url;
    customVideo.style.display = 'block';

    customVideo.addEventListener('loadedmetadata', () => {
      totalDuration3 = customVideo.duration;
      if (lastPosition3 > 0) customVideo.currentTime = lastPosition3;
      updateProgress(3);
    });
  }
});

customVideo.addEventListener('play', () => {
  interval3 = startTracking(3, () => customVideo.currentTime, 'lastPosition3', watchedRanges3, currentRange3 = {}, interval3);
});
customVideo.addEventListener('pause', () => stopTracking(interval3));
customVideo.addEventListener('ended', () => stopTracking(interval3));

document.getElementById('resetProgress3').addEventListener('click', () => {
  localStorage.removeItem('watchedRanges3');
  localStorage.removeItem('lastPosition3');
  watchedRanges3 = [];
  updateProgress(3);
  customVideo.currentTime = 0;
});

