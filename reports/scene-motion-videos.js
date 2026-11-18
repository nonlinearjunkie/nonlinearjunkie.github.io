document.querySelectorAll('.scene-video-comparison').forEach((row) => {
  const videos = [...row.querySelectorAll('video')];
  const play = row.querySelector('[data-row-play]');
  const reset = row.querySelector('[data-row-reset]');
  let playingTogether = false;

  const setPlaying = (playing) => {
    playingTogether = playing;
    play.textContent = playing ? 'Pause row' : 'Play row';
    const name = row.querySelector('h3').textContent.toLowerCase();
    play.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${name} comparison`);
  };

  play.addEventListener('click', async () => {
    if (playingTogether) {
      videos.forEach((video) => video.pause());
      setPlaying(false);
      return;
    }
    videos.forEach((video) => { video.currentTime = 0; });
    setPlaying(true);
    const results = await Promise.allSettled(videos.map((video) => video.play()));
    if (results.every((result) => result.status === 'rejected')) setPlaying(false);
  });

  reset.addEventListener('click', () => {
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
    setPlaying(false);
  });

  videos.forEach((video) => {
    video.addEventListener('pause', () => {
      if (videos.every((item) => item.paused || item.ended)) setPlaying(false);
    });
  });
});
