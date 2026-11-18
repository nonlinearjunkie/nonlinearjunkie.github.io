document.querySelectorAll('.bidex-video-figure').forEach((figure) => {
  const videos = [...figure.querySelectorAll('video')];
  const button = figure.querySelector('[data-compare-play]');
  const task = figure.id.startsWith('box') ? 'box' : 'mixer';
  let playing = false;
  const update = (value) => {
    playing = value;
    button.textContent = value ? 'Pause comparison' : 'Play comparison';
    button.setAttribute('aria-label', `${value ? 'Pause' : 'Play'} ${task} comparison`);
  };
  button.addEventListener('click', async () => {
    if (playing) {
      videos.forEach((video) => video.pause());
      update(false);
      return;
    }
    videos.forEach((video) => { video.currentTime = 0; });
    update(true);
    const results = await Promise.allSettled(videos.map((video) => video.play()));
    if (results.every((result) => result.status === 'rejected')) update(false);
  });
  videos.forEach((video) => video.addEventListener('pause', () => {
    if (videos.every((item) => item.paused || item.ended)) update(false);
  }));
});
