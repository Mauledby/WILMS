let timer = null;

self.addEventListener('message', function (e) {
  if (e.data === 'start') {
    let timeLeft = 1800; // 30 minutes in seconds

    timer = setInterval(() => {
      timeLeft--;

      if (timeLeft >= 0) {
        self.postMessage({ type: 'tick', timeLeft: formatTime(timeLeft) });
      } else {
        clearInterval(timer);
        self.postMessage({ type: 'finished' });
      }
    }, 1000);
  } else if (e.data === 'stop') {
    clearInterval(timer);
    timer = null;
  }
});

function formatTime(totalSeconds) {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${minutes}:${seconds}`;
}

