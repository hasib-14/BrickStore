/* ---- BrickStore hero intro video ---- */
(() => {
  const video = document.querySelector('#engineerVideo');
  const canvas = document.querySelector('#videoCanvas');
  if (!video || !canvas) return;

  const ctx = canvas.getContext('2d');
  let frame = 0;
  let recorded = false;

function drawEngineerScene(tick) {
  const w = canvas.width;
  const h = canvas.height;
  const loop = (tick % 210) / 210;
  const stage = Math.min(1, loop * 1.18);
  const workerPulse = (Math.sin(tick / 18) + 1) / 2;
  const productStage = Math.max(0, 1 - loop / 0.34);
  const buildStage = easeOutCubic((loop - 0.24) / 0.62);
  const homeStage = Math.min(1, buildStage);

  ctx.clearRect(0, 0, w, h);

  drawStudioBackground(loop);
  drawProductBrickScene(productStage, loop);

  if (loop > 0.18) {
    ctx.globalAlpha = easeOutCubic((loop - 0.18) / 0.18);
    drawConstructionWorld(tick, homeStage, workerPulse);
    ctx.globalAlpha = 1;
  }

  drawSequenceCaption(loop);
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, value)), 3);
}

function drawStudioBackground(loop) {
  const warmShift = easeOutCubic((loop - 0.22) / 0.34);
  const bg = ctx.createLinearGradient(0, 0, 0, 540);
  bg.addColorStop(0, `rgba(${248 - warmShift * 226}, ${248 - warmShift * 225}, ${246 - warmShift * 223}, 1)`);
  bg.addColorStop(0.58, `rgba(${239 - warmShift * 175}, ${236 - warmShift * 198}, ${228 - warmShift * 177}, 1)`);
  bg.addColorStop(1, `rgba(${226 - warmShift * 195}, ${218 - warmShift * 194}, ${206 - warmShift * 188}, 1)`);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 960, 540);
}

function drawProductBrickScene(productStage, loop) {
  const alpha = Math.min(1, Math.max(0, productStage * 1.25));
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  const zoom = 0.82 + (1 - productStage) * 0.1;
  ctx.translate(480, 244);
  ctx.scale(zoom, zoom);
  ctx.translate(-480, -244);
  drawPerforatedBrick(236, 84, 520, 250, loop);
  drawTopViewBrick(352, 402, 256, 92);
  drawTechnicalLeaders();
  ctx.restore();
}

function drawPerforatedBrick(x, y, width, height, loop) {
  const depthX = 94;
  const depthY = 70;

  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.beginPath();
  ctx.ellipse(x + width / 2 + 72, y + height + 62, width * 0.58, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  const top = [
    [x, y],
    [x + width, y + 42],
    [x + width + depthX, y + depthY],
    [x + depthX, y + depthY - 42]
  ];
  const front = [
    [x, y],
    [x + width, y + 42],
    [x + width, y + height],
    [x, y + height - 42]
  ];
  const side = [
    [x + width, y + 42],
    [x + width + depthX, y + depthY],
    [x + width + depthX, y + height + depthY - 42],
    [x + width, y + height]
  ];

  drawPoly(top, "#e96b38");
  drawBrickTexture(top, 90, loop);
  drawPoly(front, "#bf4325");
  drawBrickTexture(front, 70, loop + 1);
  drawPoly(side, "#92301f");
  drawBrickTexture(side, 48, loop + 2);

  ctx.fillStyle = "#c98250";
  ctx.beginPath();
  ctx.moveTo(x + 82, y + 148);
  ctx.lineTo(x + width - 72, y + 186);
  ctx.lineTo(x + width - 72, y + 246);
  ctx.lineTo(x + 82, y + 208);
  ctx.closePath();
  ctx.fill();
  drawSpeckles(x + 92, y + 158, width - 180, 72, 120, "#5b2a18", 0.33);

  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const cx = x + 112 + col * 88 + row * 24;
      const cy = y + 42 + row * 74 + col * 7;
      drawHole(cx, cy, 31, 24);
    }
  }

  for (let col = 0; col < 6; col += 1) {
    const cx = x + 132 + col * 70;
    const topY = y + 151 + col * 5;
    ctx.fillStyle = "#b33b22";
    ctx.beginPath();
    ctx.ellipse(cx, topY, 23, 36, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 184, 117, 0.26)";
    ctx.fillRect(cx - 20, topY - 34, 12, 64);
  }
}

function drawTopViewBrick(x, y, width, height) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(x + 8, y + height + 10, width, 8);
  ctx.fillStyle = "#df6332";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(109, 32, 20, 0.45)";
  ctx.strokeRect(x, y, width, height);
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      drawRoundHole(x + 36 + col * 47, y + 26 + row * 40, 16);
    }
  }
  drawSpeckles(x, y, width, height, 120, "#8b331f", 0.22);
}

function drawTechnicalLeaders() {
  drawLeaderLine(274, 156, 124, 156, 82, 156);
  drawLeaderLine(290, 252, 162, 252, 110, 252);
  drawLeaderLine(694, 142, 780, 84, 910, 84);
  drawLeaderLine(720, 284, 792, 246, 892, 246);
  drawLeaderLine(638, 374, 770, 374, 906, 374);
  drawLeaderLine(396, 360, 318, 432, 176, 432);
}

function drawLeaderLine(dotX, dotY, bendX, bendY, endX, endY) {
  ctx.strokeStyle = "rgba(14, 14, 14, 0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dotX, dotY);
  ctx.lineTo(bendX, bendY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.fillStyle = "#101010";
  ctx.beginPath();
  ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawConstructionWorld(tick, stage, workerPulse) {
  ctx.save();
  drawSiteBackground();
  drawScaffold();
  drawGatheringBricks(stage);
  drawHouseBuild(stage);

  const workerX = 230 + Math.min(stage, 0.82) * 470;
  const workerY = 354 - Math.min(stage, 0.65) * 76;
  drawEngineer(workerX, workerY, workerPulse);

  if (stage < 0.78) drawCarriedBrick(workerX + 95, workerY - 66, workerPulse);
  drawForegroundDetails(stage);
  ctx.restore();
}

function drawGatheringBricks(stage) {
  const count = 18;
  for (let i = 0; i < count; i += 1) {
    const row = Math.floor(i / 6);
    const col = i % 6;
    const startX = 72 + col * 54 + row * 20;
    const startY = 420 - row * 28;
    const endX = 390 + col * 48 + (row % 2) * 20;
    const endY = 404 - row * 24;
    const travel = easeOutCubic((stage - i * 0.012) / 0.36);
    const x = startX + (endX - startX) * travel;
    const y = startY + (endY - startY) * travel - Math.sin(travel * Math.PI) * 34;
    ctx.globalAlpha = 1 - Math.max(0, stage - 0.76) * 1.8;
    drawBrick(x, y, 40, 19);
    ctx.globalAlpha = 1;
  }
}

function drawSequenceCaption(loop) {
  const darkText = loop < 0.2;
  ctx.fillStyle = darkText ? "rgba(23, 18, 17, 0.86)" : "rgba(255, 250, 242, 0.9)";
  ctx.font = "700 23px Inter, sans-serif";
  ctx.fillText("Perforated red brick to a beautiful home", 64, 482);
  ctx.font = "500 15px Inter, sans-serif";
  ctx.fillText("Product detail, brick gathering, foundation, walls, roof, finished build.", 64, 510);
}

function drawPoly(points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([px, py], index) => {
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(117, 42, 24, 0.42)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

function drawBrickTexture(poly, amount, seed) {
  ctx.save();
  ctx.beginPath();
  poly.forEach(([px, py], index) => {
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.clip();
  const minX = Math.min(...poly.map((p) => p[0]));
  const maxX = Math.max(...poly.map((p) => p[0]));
  const minY = Math.min(...poly.map((p) => p[1]));
  const maxY = Math.max(...poly.map((p) => p[1]));
  drawSpeckles(minX, minY, maxX - minX, maxY - minY, amount, "#6c2b20", 0.18, seed);
  ctx.restore();
}

function drawSpeckles(x, y, width, height, amount, color, alpha, seed = 1) {
  ctx.fillStyle = color;
  ctx.globalAlpha *= alpha;
  for (let i = 0; i < amount; i += 1) {
    const px = x + ((Math.sin(i * 47.7 + seed * 21) + 1) / 2) * width;
    const py = y + ((Math.sin(i * 18.3 + seed * 43) + 1) / 2) * height;
    ctx.fillRect(px, py, 2 + (i % 3), 1 + (i % 2));
  }
  ctx.globalAlpha /= alpha;
}

function drawHole(cx, cy, rx, ry) {
  const grad = ctx.createRadialGradient(cx - rx * 0.2, cy - ry * 0.4, 3, cx, cy, rx);
  grad.addColorStop(0, "#9c3b1e");
  grad.addColorStop(0.55, "#6f2718");
  grad.addColorStop(1, "#33100b");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 187, 126, 0.38)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx - 2, cy - 3, rx - 2, ry - 3, 0.08, Math.PI, Math.PI * 1.9);
  ctx.stroke();
}

function drawRoundHole(cx, cy, radius) {
  const grad = ctx.createRadialGradient(cx - 4, cy - 6, 2, cx, cy, radius);
  grad.addColorStop(0, "#a94322");
  grad.addColorStop(0.58, "#6d2718");
  grad.addColorStop(1, "#2d0f0a");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawSunAndClouds(tick) {
  ctx.fillStyle = "rgba(255, 222, 151, 0.78)";
  ctx.beginPath();
  ctx.arc(800, 96, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 250, 242, 0.22)";
  for (let i = 0; i < 3; i += 1) {
    const x = 96 + i * 260 + Math.sin(tick / 80 + i) * 18;
    ctx.beginPath();
    ctx.ellipse(x, 96 + i * 18, 62, 18, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 42, 92 + i * 18, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSiteBackground() {
  ctx.fillStyle = "rgba(42, 51, 47, 0.34)";
  for (let i = 0; i < 7; i += 1) {
    ctx.fillRect(70 + i * 128, 145 - (i % 2) * 22, 58, 230);
    ctx.fillRect(82 + i * 128, 160 - (i % 2) * 22, 34, 14);
    ctx.fillRect(82 + i * 128, 198 - (i % 2) * 22, 34, 14);
  }

  const ground = ctx.createLinearGradient(0, 376, 0, 540);
  ground.addColorStop(0, "#6f654d");
  ground.addColorStop(0.42, "#3f3025");
  ground.addColorStop(1, "#1f1715");
  ctx.fillStyle = ground;
  ctx.fillRect(0, 376, 960, 164);

  ctx.fillStyle = "rgba(255, 250, 242, 0.12)";
  ctx.fillRect(356, 364, 430, 11);
  ctx.fillStyle = "rgba(20, 15, 13, 0.26)";
  ctx.beginPath();
  ctx.ellipse(560, 420, 320, 34, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawScaffold() {
  ctx.strokeStyle = "rgba(255, 250, 242, 0.34)";
  ctx.lineWidth = 4;
  for (let x = 336; x <= 806; x += 78) {
    ctx.beginPath();
    ctx.moveTo(x, 188);
    ctx.lineTo(x, 384);
    ctx.stroke();
  }
  for (let y = 218; y <= 362; y += 48) {
    ctx.beginPath();
    ctx.moveTo(326, y);
    ctx.lineTo(812, y);
    ctx.stroke();
  }
}

function drawBrickPiles(stage) {
  const pileFade = Math.max(0.12, 1 - stage * 0.65);
  ctx.globalAlpha = pileFade;
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 8 - row; col += 1) {
      drawBrick(82 + col * 45 + row * 22, 410 - row * 24, 40, 19);
    }
  }
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 7 - row; col += 1) {
      drawBrick(756 + col * 36 + row * 18, 416 - row * 21, 32, 16);
    }
  }
  ctx.globalAlpha = 1;
}

function drawHouseBuild(stage) {
  const baseX = 392;
  const baseY = 392;
  const brickW = 46;
  const brickH = 21;
  const rows = 8;
  const cols = 8;
  const baseProgress = easeOutCubic(stage / 0.28);
  const wallProgress = easeOutCubic((stage - 0.18) / 0.42);
  const detailProgress = easeOutCubic((stage - 0.55) / 0.25);
  const roofProgress = easeOutCubic((stage - 0.68) / 0.22);
  const polishProgress = easeOutCubic((stage - 0.84) / 0.14);

  ctx.fillStyle = "rgba(245, 238, 222, 0.92)";
  ctx.fillRect(baseX - 18, baseY + 12, 420 * baseProgress, 18);

  let visibleBricks = Math.floor(rows * cols * wallProgress);
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (visibleBricks <= 0) continue;
      const x = baseX + col * brickW + (row % 2 ? brickW / 2 : 0);
      const y = baseY - row * brickH;
      const inDoor = col >= 3 && col <= 4 && row <= 3;
      const inLeftWindow = col >= 1 && col <= 2 && row >= 4 && row <= 5;
      const inRightWindow = col >= 5 && col <= 6 && row >= 4 && row <= 5;
      if (!inDoor && !inLeftWindow && !inRightWindow) drawTexturedBrick(x, y, brickW - 3, brickH);
      visibleBricks -= 1;
    }
  }

  if (detailProgress > 0) drawHomeDetails(baseX, baseY, detailProgress);
  if (roofProgress > 0) drawRoof(baseX, baseY, roofProgress);
  if (polishProgress > 0) drawFinishedGlow(baseX, baseY, polishProgress);
}

function drawTexturedBrick(x, y, width, height) {
  drawBrick(x, y, width, height);
  const flecks = [
    [0.22, 0.35],
    [0.58, 0.28],
    [0.75, 0.66]
  ];
  ctx.fillStyle = "rgba(255, 238, 214, 0.16)";
  flecks.forEach(([fx, fy]) => ctx.fillRect(x + width * fx, y + height * fy, 3, 2));
}

function drawHomeDetails(baseX, baseY, progress) {
  ctx.globalAlpha = progress;
  ctx.fillStyle = "#3b2720";
  ctx.fillRect(baseX + 143, baseY - 63, 68, 76);
  ctx.fillStyle = "#bd8b3a";
  ctx.fillRect(baseX + 196, baseY - 27, 5, 5);

  drawWindow(baseX + 58, baseY - 122, 62, 46);
  drawWindow(baseX + 244, baseY - 122, 62, 46);

  ctx.fillStyle = "rgba(255, 250, 242, 0.86)";
  ctx.fillRect(baseX + 16, baseY + 30, 328, 9);
  ctx.globalAlpha = 1;
}

function drawWindow(x, y, width, height) {
  const glass = ctx.createLinearGradient(x, y, x + width, y + height);
  glass.addColorStop(0, "#d8eef0");
  glass.addColorStop(1, "#537078");
  ctx.fillStyle = glass;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(255, 250, 242, 0.9)";
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, width, height);
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width / 2, y + height);
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width, y + height / 2);
  ctx.stroke();
}

function drawRoof(baseX, baseY, progress) {
  ctx.save();
  ctx.globalAlpha = progress;
  ctx.beginPath();
  ctx.moveTo(baseX - 26, baseY - 162);
  ctx.lineTo(baseX + 178, baseY - 278);
  ctx.lineTo(baseX + 382, baseY - 162);
  ctx.closePath();
  ctx.fillStyle = "#4b2019";
  ctx.fill();

  ctx.strokeStyle = "#c98547";
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.fillStyle = "#2f1815";
  ctx.fillRect(baseX + 276, baseY - 266, 34, 78);
  ctx.fillStyle = "#6c2b20";
  ctx.fillRect(baseX + 268, baseY - 278, 50, 16);
  ctx.restore();
}

function drawFinishedGlow(baseX, baseY, progress) {
  ctx.globalAlpha = progress;
  ctx.fillStyle = "#577060";
  ctx.beginPath();
  ctx.arc(baseX - 38, baseY + 36, 34, 0, Math.PI * 2);
  ctx.arc(baseX + 408, baseY + 36, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 250, 242, 0.58)";
  ctx.lineWidth = 3;
  ctx.strokeRect(baseX - 14, baseY - 168, 384, 205);
  ctx.globalAlpha = 1;
}

function drawCarriedBrick(x, y, progress) {
  ctx.save();
  ctx.translate(x, y + progress * 8);
  ctx.rotate(-0.16 + progress * 0.2);
  drawBrick(0, 0, 48, 23);
  ctx.restore();
}

function drawForegroundDetails(stage) {
  ctx.fillStyle = "rgba(245, 238, 222, 0.28)";
  ctx.fillRect(62, 448, 248 * Math.min(1, stage * 1.6), 4);
  ctx.fillStyle = "rgba(189, 139, 58, 0.72)";
  ctx.fillRect(340, 448, 25, 5);
  ctx.fillRect(370, 448, 25, 5);
}

function drawBrick(x, y, width, height) {
  const grad = ctx.createLinearGradient(x, y, x + width, y + height);
  grad.addColorStop(0, "#df6840");
  grad.addColorStop(0.55, "#a83923");
  grad.addColorStop(1, "#651f18");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(255, 231, 208, 0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
}

function drawEngineer(x, y, progress) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "#f2c66f";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(48, -72, 24, Math.PI, 0);
  ctx.stroke();

  ctx.fillStyle = "#d9a45c";
  ctx.beginPath();
  ctx.arc(48, -48, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#577060";
  ctx.fillRect(22, -26, 52, 78);

  ctx.strokeStyle = "#d9a45c";
  ctx.beginPath();
  ctx.moveTo(34, -12);
  ctx.lineTo(2 + progress * 30, 22 - progress * 40);
  ctx.moveTo(68, -10);
  ctx.lineTo(112 + progress * 20, -20 - progress * 45);
  ctx.stroke();

  ctx.strokeStyle = "#222728";
  ctx.beginPath();
  ctx.moveTo(36, 52);
  ctx.lineTo(20, 112);
  ctx.moveTo(62, 52);
  ctx.lineTo(92, 112);
  ctx.stroke();
  ctx.restore();
}

function animateCanvasFallback() {
  frame += 1;
  drawEngineerScene(frame);
  if (!recorded) requestAnimationFrame(animateCanvasFallback);
}

function makeVideoLoop() {
  if (!canvas.captureStream || !window.MediaRecorder) {
    canvas.style.opacity = "0.82";
    animateCanvasFallback();
    return;
  }

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  const stream = canvas.captureStream(30);
  const chunks = [];
  let recorder;

  try {
    recorder = new MediaRecorder(stream, { mimeType });
  } catch (error) {
    canvas.style.opacity = "0.82";
    animateCanvasFallback();
    return;
  }

  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  recorder.onstop = () => {
    recorded = true;
    video.src = URL.createObjectURL(new Blob(chunks, { type: mimeType }));
    video.play().catch(() => {
      canvas.style.opacity = "0.82";
      animateCanvasFallback();
    });
    video.addEventListener(
      "playing",
      () => {
        document.querySelector(".hero-video-wrap").classList.add("video-ready");
      },
      { once: true }
    );
  };

  recorder.start();
  const totalFrames = 210;
  function render() {
    frame += 1;
    drawEngineerScene(frame);
    if (frame < totalFrames) {
      requestAnimationFrame(render);
    } else {
      recorder.stop();
    }
  }
  render();
}

  makeVideoLoop();
})();
/* ============================================================
   BRICK-BYTE â€” script.js
   ============================================================ */

/* â”€â”€ 1. REVEAL ON SCROLL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* â”€â”€ 2. 3D GALLERY CUBE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const cube    = document.getElementById('galleryCube');
const gcLabel = document.getElementById('gcLabel');
const dots    = document.querySelectorAll('.gd');
const VIEWS   = [
  { label:'Front Face',   rx:-15, ry:  25 },
  { label:'Side Profile', rx:-15, ry: 115 },
  { label:'Back Face',    rx:-15, ry: 205 },
  { label:'Other Side',   rx:-15, ry: 295 },
  { label:'Top View',     rx: 70, ry:  25 },
  { label:'Bottom View',  rx:-90, ry:  25 },
];
let cv=0, drag=false, sx=0, sy=0, brx=-15, bry=25, drx=0, dry=0;
function applyView(v, anim=true) {
  cube.style.transition = anim ? 'transform .6s ease' : 'none';
  cube.style.transform  = `rotateX(${v.rx+drx}deg) rotateY(${v.ry+dry}deg)`;
  gcLabel.textContent = v.label;
  dots.forEach((d,i) => d.classList.toggle('active', i===cv));
  brx=v.rx; bry=v.ry; drx=0; dry=0;
}
function goView(idx) { cv=(idx+VIEWS.length)%VIEWS.length; applyView(VIEWS[cv]); }
document.getElementById('gcLeft').addEventListener('click',  () => goView(cv-1));
document.getElementById('gcRight').addEventListener('click', () => goView(cv+1));
dots.forEach((d,i) => d.addEventListener('click', () => goView(i)));
const sc2 = document.querySelector('.gallery-scene');
sc2.addEventListener('mousedown', e => { drag=true; sx=e.clientX; sy=e.clientY; cube.style.transition='none'; });
window.addEventListener('mousemove', e => { if(!drag) return; dry=(e.clientX-sx)*.5; drx=-(e.clientY-sy)*.3; cube.style.transform=`rotateX(${brx+drx}deg) rotateY(${bry+dry}deg)`; });
window.addEventListener('mouseup', () => { if(!drag) return; drag=false; brx+=drx; bry+=dry; drx=0; dry=0; cube.style.transition='transform .4s ease'; });
sc2.addEventListener('touchstart', e => { drag=true; sx=e.touches[0].clientX; sy=e.touches[0].clientY; cube.style.transition='none'; }, {passive:true});
sc2.addEventListener('touchmove',  e => { if(!drag) return; dry=(e.touches[0].clientX-sx)*.5; drx=-(e.touches[0].clientY-sy)*.3; cube.style.transform=`rotateX(${brx+drx}deg) rotateY(${bry+dry}deg)`; }, {passive:true});
sc2.addEventListener('touchend',   () => { drag=false; brx+=drx; bry+=dry; drx=0; dry=0; cube.style.transition='transform .4s ease'; });
applyView(VIEWS[0], false);

/* â”€â”€ 3. BRICK-BYTE RUNNER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const canvas  = document.getElementById('runnerCanvas');
const ctx     = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const scoreEl = document.getElementById('score');
const bestEl  = document.getElementById('bestScore');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMsg   = document.getElementById('overlayMsg');

const W = canvas.width, H = canvas.height;

// â”€â”€ Colours (all brick-brand palette) â”€â”€
const C = {
  sky:    '#120208',
  ground: '#1C0A06',
  brick:  '#C0392B',
  brickH: '#E85D4A',
  brickS: '#7B241C',
  bad:    '#6B7280',
  mortar: '#0F0F0F',
  runner: '#FAF6F0',
  skin:   '#E8C99A',
  gold:   '#F6C344',
  red:    '#E74C3C',
  white:  '#FFFFFF',
};

// â”€â”€ Game state â”€â”€
let running = false, animId = null;
let score = 0, bestScore = 0, coinScore = 0;
let speed = 3, frameN = 0;
let particles = [], coins = [];
let lives = 3, invincible = 0, flashRed = 0;

// â”€â”€ Ground â”€â”€
const GY = H * 0.78;   // ground y (where runner stands)
const FLOOR_H = 44;    // visual brick floor height

// â”€â”€ Runner â”€â”€
const RX = 110;        // fixed x position
const runner = {
  y: GY,               // bottom of runner feet
  vy: 0,
  onGround: true,
  usedDouble: false,
  dead: false,
  frame: 0, ft: 0,
};

// â”€â”€ Obstacles: { x, type:'wall'|'gap'|'coin', w, h, collected } â”€â”€
let obstacles = [];
let nextObstX = W + 200;  // when to spawn next obstacle
let gapActive = false;    // currently in a gap?

// â”€â”€ Gap tracking (for gap-death) â”€â”€
// We draw gaps as missing floor segments. Track them as obstacles type 'gap'.

// â”€â”€ Difficulty â”€â”€
function getSpeed()   { return 3 + Math.min(score * 0.028, 5); }
function getMinGap()  { return Math.max(380 - score * 1.5, 220); } // gap between obstacles

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ SPAWN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function spawnNext() {
  const s = getSpeed();
  const roll = Math.random();
  let obj;

  if (score < 8) {
    // Only coins early on â€” purely reward phase
    obj = makeCoin();
  } else if (score < 20) {
    // Introduce wall bricks
    if (roll < 0.55) obj = makeCoin();
    else             obj = makeWall();
  } else if (score < 40) {
    // Add gaps
    if (roll < 0.35) obj = makeCoin();
    else if (roll < 0.65) obj = makeWall();
    else obj = makeGap();
  } else {
    // Full mix
    if (roll < 0.25)      obj = makeCoin();
    else if (roll < 0.55) obj = makeWall();
    else if (roll < 0.75) obj = makeGap();
    else                  obj = makeDoubleWall();
  }

  obstacles.push(obj);
  // Schedule next obstacle â€” further apart at higher speeds so it's still playable
  nextObstX = obj.x + obj.w + getMinGap() + Math.random() * 120;
}

function makeCoin() {
  const h = 26 + Math.random() * 40;  // height above ground
  return { x: W + 60, type:'coin', w:18, h:0, cy: GY - h, collected:false };
}

function makeWall() {
  // Single brick wall â€” 1 or 2 bricks tall, random
  const tall = score > 30 && Math.random() > 0.6;
  const bh   = tall ? 80 : 46;
  return { x: W + 60, type:'wall', w:38, h:bh, brand: Math.random() > 0.3 };
}

function makeDoubleWall() {
  return { x: W + 60, type:'dwall', w:38, h:46, gap: 38 + Math.random()*20 };
}

function makeGap() {
  return { x: W + 60, type:'gap', w: 55 + Math.random()*30, h:0 };
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ DRAWING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function drawBG() {
  // Sky gradient
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0, '#120208');
  g.addColorStop(1, '#2A0A0A');
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // Parallax city silhouette
  ctx.fillStyle = 'rgba(100,20,10,0.22)';
  const blds = [[0,70,55],[65,45,38],[112,28,48],[172,65,33],[215,18,42],[272,55,52],[335,38,28],[370,22,48],[430,52,38],[480,32,43],[535,62,57],[605,28,32],[648,42,52]];
  blds.forEach(([bx,bh,bw]) => {
    ctx.fillRect(bx, GY-FLOOR_H-bh, bw, bh);
    ctx.fillStyle = 'rgba(255,120,40,0.1)';
    for(let wy=GY-FLOOR_H-bh+8; wy<GY-FLOOR_H-12; wy+=16) {
      for(let wx=bx+5; wx<bx+bw-5; wx+=11) {
        if(Math.random()>0.45) ctx.fillRect(wx,wy,4,7);
      }
    }
    ctx.fillStyle = 'rgba(100,20,10,0.22)';
  });

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  for(let i=0;i<40;i++) {
    ctx.beginPath();
    ctx.arc((i*179+frameN*0.05)%W, (i*83)%(GY-FLOOR_H-30), 0.8, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawFloor(gaps) {
  // Full floor rect first
  ctx.fillStyle = C.ground;
  ctx.fillRect(0, GY, W, H - GY);

  // Draw brick pattern on floor (scrolls with speed)
  const BROW = FLOOR_H / 2;
  const offset = (frameN * getSpeed()) % 58;  // scroll
  for(let row=0; row<2; row++) {
    const rowOff = row===1 ? 29 : 0;
    const y = GY + row * BROW;
    for(let bx = -offset - rowOff; bx < W + 60; bx += 58) {
      const bw = 54, bh = BROW - 3;
      ctx.fillStyle = C.brick;
      ctx.fillRect(bx, y, bw, bh);
      ctx.fillStyle = C.brickH;
      ctx.fillRect(bx, y, bw, 3);
      ctx.fillStyle = C.brickS;
      ctx.fillRect(bx, y+bh-3, bw, 3);
      // BÂ·B logo on brand bricks
      ctx.fillStyle = 'rgba(255,210,0,0.18)';
      ctx.font = '7px "Black Han Sans",sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BÂ·B', bx+27, y+BROW/2+3);
    }
    // mortar row
    ctx.fillStyle = C.mortar;
    ctx.fillRect(0, y+BROW-3, W, 3);
  }

  // Cut gaps (paint void over gap zones)
  gaps.forEach(g => {
    ctx.fillStyle = C.sky; // erase floor with bg color
    ctx.fillRect(g.x, GY, g.w, H-GY);
    // Danger glow at gap edge
    const gl = ctx.createLinearGradient(g.x, GY, g.x, H);
    gl.addColorStop(0, 'rgba(192,57,43,0.35)');
    gl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gl;
    ctx.fillRect(g.x, GY, g.w, FLOOR_H*2);
  });
}

function drawObstacle(o) {
  if(o.type === 'coin' || o.type === 'gap') return; // handled separately
  const x = o.x, y = GY - o.h;

  if(o.type === 'wall') {
    // Draw brick wall column
    const rows = Math.round(o.h / 24);
    for(let r=0; r<rows; r++) {
      const boff = r%2===0 ? 0 : 10;
      const by = GY - (r+1)*24;
      ctx.fillStyle = o.brand ? C.brick : C.bad;
      ctx.beginPath(); ctx.roundRect(x - boff*0.3, by, o.w, 21, 2); ctx.fill();
      ctx.fillStyle = o.brand ? C.brickH : '#9CA3AF';
      ctx.fillRect(x - boff*0.3, by, o.w, 3);
      ctx.fillStyle = o.brand ? C.brickS : '#4B5563';
      ctx.fillRect(x - boff*0.3, by+18, o.w, 3);
      if(o.brand) {
        ctx.fillStyle = 'rgba(255,210,0,0.25)';
        ctx.font = 'bold 7px "Black Han Sans",sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BÂ·B', x+o.w/2-boff*0.3, by+13);
      }
      // Mortar
      ctx.fillStyle = C.mortar;
      ctx.fillRect(x - boff*0.3, by+21, o.w, 3);
    }
    // Warning label on fake bricks
    if(!o.brand) {
      ctx.fillStyle = 'rgba(255,80,80,0.7)';
      ctx.font = 'bold 7px Inter,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FAKE', x+o.w/2, GY - o.h - 5);
    }
  }

  if(o.type === 'dwall') {
    // Two walls with a gap runner can jump through
    [0, o.gap+o.w].forEach(offset => {
      for(let r=0; r<2; r++) {
        const by = GY - (r+1)*24;
        ctx.fillStyle = C.brick;
        ctx.beginPath(); ctx.roundRect(x+offset, by, o.w, 21, 2); ctx.fill();
        ctx.fillStyle = C.brickH;
        ctx.fillRect(x+offset, by, o.w, 3);
        ctx.fillStyle = C.brickS;
        ctx.fillRect(x+offset, by+18, o.w, 3);
        ctx.fillStyle = 'rgba(255,210,0,0.2)';
        ctx.font = 'bold 7px "Black Han Sans",sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BÂ·B', x+offset+o.w/2, by+13);
        ctx.fillStyle = C.mortar;
        ctx.fillRect(x+offset, by+21, o.w, 3);
      }
    });
    // Arrow hint
    ctx.fillStyle = 'rgba(246,195,68,0.7)';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('â–² JUMP', x+o.w+o.gap/2, GY - 55);
  }
}

function drawCoinObj(o) {
  if(o.collected) return;
  const pulse = Math.sin(frameN * 0.13 + o.x) * 3;
  ctx.save();
  ctx.translate(o.x+9, o.cy + pulse);
  ctx.shadowColor = C.gold; ctx.shadowBlur = 14;
  ctx.fillStyle = C.gold;
  ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px Inter,sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('B',0,0);
  ctx.shadowBlur=0;
  ctx.restore();
}

// Runner â€” stick figure with hard hat
function drawRunner() {
  if(invincible > 0 && Math.floor(frameN/4)%2===0) return;
  ctx.save();
  const ry = runner.y;
  ctx.translate(RX, ry);
  if(runner.dead) ctx.rotate(0.4);

  const ls = Math.sin(runner.frame * 0.5) * 14;

  // Ground shadow
  if(!runner.dead && runner.onGround) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0,0,14,4,0,0,Math.PI*2); ctx.fill();
  }

  ctx.strokeStyle = C.runner; ctx.lineWidth=3; ctx.lineCap='round';

  // Head
  ctx.fillStyle = C.skin;
  ctx.beginPath(); ctx.arc(0,-46,9,0,Math.PI*2); ctx.fill();

  // Hard hat (brand red)
  ctx.fillStyle = C.brick;
  ctx.beginPath();
  ctx.moveTo(-12,-52); ctx.lineTo(12,-52); ctx.lineTo(10,-45); ctx.lineTo(-10,-45);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,200,0,0.5)';
  ctx.font = '6px "Black Han Sans",sans-serif';
  ctx.textAlign='center';
  ctx.fillText('B', 0,-47);

  if(!runner.dead) {
    // Body
    ctx.beginPath(); ctx.moveTo(0,-36); ctx.lineTo(0,-14); ctx.stroke();
    // Arms
    ctx.beginPath(); ctx.moveTo(0,-30); ctx.lineTo(-14,-20-ls*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-30); ctx.lineTo(14,-20+ls*0.4); ctx.stroke();
    // Legs
    ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(-10, ls>0?2:6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(10,  ls>0?6:2); ctx.stroke();
    // Shoes
    ctx.fillStyle='#2A2A2A';
    ctx.beginPath(); ctx.ellipse(-10,ls>0?4:8,7,4,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(10, ls>0?8:4,7,4,0,0,Math.PI*2); ctx.fill();
  } else {
    // Dead sprawl
    ctx.beginPath(); ctx.moveTo(0,-36); ctx.lineTo(0,-14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-30); ctx.lineTo(-18,-16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-30); ctx.lineTo(16,-14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(-14,6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-14); ctx.lineTo(12,4); ctx.stroke();
  }
  ctx.restore();
}

// Particles
function spawnP(x,y,col,n=14) {
  for(let i=0;i<n;i++) {
    particles.push({x,y, vx:(Math.random()-.5)*8, vy:-Math.random()*9-2,
      life:1, size:3+Math.random()*6, col: col||C.brick});
  }
}
function tickParticles() {
  particles = particles.filter(p=>p.life>0);
  particles.forEach(p=>{
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.38; p.life-=0.03;
    ctx.globalAlpha=p.life;
    ctx.fillStyle=p.col;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha=1;
}

// HUD
function drawHUD() {
  // Hearts
  for(let i=0;i<3;i++) {
    ctx.globalAlpha = i<lives ? 1 : 0.18;
    ctx.font='17px serif'; ctx.textAlign='left';
    ctx.fillText('â™¥', 14+i*24, 26);
  }
  ctx.globalAlpha=1;

  // Score
  ctx.fillStyle='rgba(192,57,43,0.95)';
  ctx.font='bold 15px Inter,sans-serif';
  ctx.textAlign='right';
  ctx.fillText(`${Math.floor(score)+coinScore} pts`, W-14, 26);

  // Double jump indicator
  const djUsed = runner.usedDouble;
  ctx.fillStyle = djUsed ? 'rgba(255,255,255,0.1)' : 'rgba(192,57,43,0.75)';
  ctx.beginPath(); ctx.roundRect(W-95, H-30, 82, 20, 4); ctx.fill();
  ctx.fillStyle = djUsed ? 'rgba(255,255,255,0.25)' : '#fff';
  ctx.font='bold 9px Inter'; ctx.textAlign='center';
  ctx.fillText(djUsed ? 'JUMP USED':'â†‘ DOUBLE JUMP', W-54, H-17);

  // Speed ribbon
  if(getSpeed() > 6) {
    ctx.fillStyle='rgba(231,76,60,0.75)';
    ctx.font='bold 10px Inter'; ctx.textAlign='left';
    ctx.fillText('âš¡ SPEED BOOST', 14, H-12);
  }

  // Red flash on hit
  if(flashRed > 0) {
    ctx.fillStyle=`rgba(220,0,0,${flashRed/80*0.32})`;
    ctx.fillRect(0,0,W,H);
    flashRed--;
  }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ RESET â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function resetGame() {
  score=0; coinScore=0; frameN=0;
  particles=[]; coins=[]; obstacles=[];
  lives=3; invincible=0; flashRed=0;
  runner.y=GY; runner.vy=0;
  runner.onGround=true; runner.usedDouble=false;
  runner.dead=false; runner.frame=0; runner.ft=0;
  nextObstX = W + 220;
  scoreEl.textContent='0';
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ GAME LOOP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function gameLoop() {
  if(!running) return;
  frameN++;
  ctx.clearRect(0,0,W,H);

  const spd = getSpeed();

  // Collect gap obstacles for floor drawing
  const gaps = obstacles.filter(o=>o.type==='gap');

  drawBG();
  drawFloor(gaps);

  // Move & draw obstacles
  obstacles.forEach(o => { o.x -= spd; });
  obstacles = obstacles.filter(o => {
    const right = o.type==='dwall' ? o.x+o.w+o.gap+o.w : o.x+(o.w||55);
    return right > -10;
  });

  // Spawn next obstacle
  if(obstacles.length === 0 || nextObstX - obstacles[obstacles.length-1].x < 0) {
    // nextObstX is world-x; shift with scroll
    nextObstX -= spd;
    if(nextObstX <= W) spawnNext();
  } else {
    nextObstX -= spd;
    if(nextObstX <= W) spawnNext();
  }

  // Draw walls & double-walls
  obstacles.forEach(o => drawObstacle(o));

  // Draw coins (type coin obstacles)
  obstacles.forEach(o => { if(o.type==='coin') drawCoinObj(o); });

  // Runner physics
  if(!runner.dead) {
    // Gravity
    runner.vy += 0.62;
    runner.y  += runner.vy;

    if(runner.y >= GY) {
      runner.y = GY;
      runner.vy = 0;
      runner.onGround = true;
      runner.usedDouble = false;
    } else {
      runner.onGround = false;
    }

    // Leg animation
    runner.ft++;
    if(runner.ft > 5) { runner.frame++; runner.ft=0; }

    // Invincibility countdown
    if(invincible>0) invincible--;

    // â”€â”€ Collision â”€â”€
    // 1. Gap â€” only lethal when on ground
    const underGap = gaps.find(g => RX+14 > g.x && RX-14 < g.x+g.w);
    if(underGap && runner.onGround) {
      hit(C.red);
    }

    // 2. Wall collision
    const hitWall = obstacles.find(o => {
      if(o.type !== 'wall') return false;
      const ry = runner.y;  // feet
      const rtop = ry - 60; // head approx
      const wallTop = GY - o.h;
      return RX+13 > o.x && RX-13 < o.x+o.w && ry > wallTop && rtop < GY;
    });
    if(hitWall && invincible===0) {
      if(hitWall.brand) {
        // Brand brick wall â€” safe! award points
        hitWall.type='scored'; // mark so we don't re-score
        coinScore += 3;
        spawnP(hitWall.x+hitWall.w/2, GY-hitWall.h/2, C.gold, 10);
      } else {
        hit(C.bad);
      }
    }

    // 3. Double wall â€” detect hole passage
    const hitDwall = obstacles.find(o => {
      if(o.type !== 'dwall') return false;
      const passX = o.x+o.w;
      const passEnd = passX + o.gap;
      // runner is to the right of left wall AND left of right wall
      if(RX+13 > o.x && RX-13 < passEnd) {
        // Is runner in the gap passage (jumping through)?
        if(RX-13 >= passX && RX+13 <= passEnd) return false; // safely through
        return true; // hitting a wall section
      }
      return false;
    });
    if(hitDwall && invincible===0) hit(C.bad);

    // 4. Coin collection
    obstacles.forEach(o => {
      if(o.type==='coin' && !o.collected) {
        if(Math.abs((o.x+9) - RX) < 22 && Math.abs(o.cy - runner.y) < 60) {
          o.collected = true;
          coinScore += 5;
          spawnP(o.x+9, o.cy, C.gold, 10);
        }
      }
    });

    // Score
    score += 0.05;
    const total = Math.floor(score) + coinScore;
    scoreEl.textContent = total;
    if(total > bestScore) { bestScore=total; bestEl.textContent=bestScore; }

  } else {
    // Dead â€” fall
    runner.y += 10;
  }

  drawRunner();
  tickParticles();
  drawHUD();

  animId = requestAnimationFrame(gameLoop);
}

function hit(col) {
  if(invincible > 0) return;
  lives--;
  flashRed = 80;
  spawnP(RX, runner.y-30, col);
  if(lives <= 0) {
    runner.dead = true;
    setTimeout(showGameOver, 800);
  } else {
    invincible = 130;  // ~2s grace
  }
}

function showGameOver() {
  cancelAnimationFrame(animId);
  running = false;
  const total = Math.floor(score)+coinScore;
  overlayTitle.textContent = `Score: ${total}`;
  const msgs = [
    'Keep running â€” the brick awaits.',
    'Grey bricks crumble. Brick-Byte holds.',
    'Edition 001 demands a better run.',
    'The void has no bricks. Run smarter.',
  ];
  overlayMsg.textContent = msgs[Math.floor(Math.random()*msgs.length)];
  document.getElementById('startGame').textContent = 'Run Again';
  overlay.classList.remove('hidden');
}

function startGame() {
  overlay.classList.add('hidden');
  resetGame();
  running = true;
  cancelAnimationFrame(animId);
  gameLoop();
}

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('resetGame').addEventListener('click', () => {
  cancelAnimationFrame(animId); running=false;
  overlayTitle.textContent='Brick-Byte Runner';
  overlayMsg.textContent='Jump over walls. Collect B coins. Land on brick.';
  document.getElementById('startGame').textContent='Start Running';
  overlay.classList.remove('hidden');
});

// â”€â”€ Controls â”€â”€
function doJump() {
  if(runner.dead) return;
  if(runner.onGround) {
    runner.vy = -16;
    runner.onGround = false;
    runner.usedDouble = false;
  } else if(!runner.usedDouble) {
    runner.vy = -15;
    runner.usedDouble = true;
    spawnP(RX, runner.y-20, C.white, 8);
  }
}

document.addEventListener('keydown', e => {
  if(!running) return;
  if(e.code==='Space'||e.code==='ArrowUp') { e.preventDefault(); doJump(); }
});

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if(!running) return;
  doJump();
}, { passive:false });

canvas.addEventListener('click', () => {
  if(!running) return;
  doJump();
});

/* â”€â”€ 4. ORDER FORM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function handleOrder() {
  const name  = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const addr  = document.getElementById('address').value.trim();
  if(!name||!email||!phone||!addr) { alert('Please fill in all required fields.'); return; }
  alert(`Thank you, ${name}! Your Brick-Byte order has been placed. We'll confirm via ${email} shortly.`);
}
