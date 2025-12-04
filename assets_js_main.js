// Lightweight starfield with mouse parallax + small interaction
(() => {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(DPR, DPR);

  const stars = [];
  const STAR_COUNT = Math.round((w * h) / 7000);

  let mx = w / 2, my = h / 2;
  let vx = 0, vy = 0;

  function rand(min, max){ return Math.random() * (max - min) + min }

  for (let i=0;i<STAR_COUNT;i++){
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      z: rand(0.2,1),
      size: rand(0.2,1.6),
      twinkle: Math.random()*Math.PI*2
    });
  }

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(DPR, DPR);
  }

  let last = performance.now();
  function frame(t){
    const dt = Math.min(50, t - last);
    last = t;
    vx += (mx - w/2) * 0.00005 * dt;
    vy += (my - h/2) * 0.00005 * dt;

    ctx.clearRect(0,0,w,h);
    // subtle gradient
    const grad = ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0, 'rgba(6,12,20,0.2)');
    grad.addColorStop(1, 'rgba(2,6,12,0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,w,h);

    for (let s of stars){
      s.x += (s.x - w/2) * s.z * 0.0002 * dt + vx * s.z * 0.2;
      s.y += (s.y - h/2) * s.z * 0.0002 * dt + vy * s.z * 0.2;

      // wrap
      if (s.x < -10) s.x = w + 10;
      if (s.x > w + 10) s.x = -10;
      if (s.y < -10) s.y = h + 10;
      if (s.y > h + 10) s.y = -10;

      const alpha = 0.7 * (0.5 + 0.5 * Math.sin((performance.now()/600) + s.twinkle));
      ctx.fillStyle = `rgba(180,230,255,${alpha * s.z})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * (1 + 0.4 * s.z), 0, Math.PI*2);
      ctx.fill();
    }

    // gentle slow decay
    vx *= 0.95;
    vy *= 0.95;

    requestAnimationFrame(frame);
  }

  addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  addEventListener('resize', () => {
    resize();
  });

  // Surprise button — creates a quick burst
  const surpriseBtn = document.getElementById('surpriseBtn');
  surpriseBtn?.addEventListener('click', () => {
    for (let i=0;i<30;i++){
      stars.push({
        x: w/2 + (Math.random()-0.5) * 200,
        y: h/2 + (Math.random()-0.5) * 200,
        z: Math.random()*1.2 + 0.2,
        size: Math.random()*3 + 0.6,
        twinkle: Math.random()*Math.PI*2
      });
    }
    // trim if too many
    if (stars.length > STAR_COUNT * 2) stars.splice(0, stars.length - STAR_COUNT * 2);
  });

  requestAnimationFrame(frame);
})();