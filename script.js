const video = document.querySelector("#engineerVideo");
const canvas = document.querySelector("#videoCanvas");
const ctx = canvas.getContext("2d");
const brick = document.querySelector("#brick3d");
const spinButton = document.querySelector("#spinBrick");
const gameBoard = document.querySelector("#gameBoard");
const resetButton = document.querySelector("#resetGame");
const scoreEl = document.querySelector("#score");
const guide = document.querySelector("#dropGuide");

let frame = 0;
let recorded = false;
let gameScore = 0;
let brickCount = 0;
let moverX = 130;
let moverDirection = 1;
let gameAnimation = 0;

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

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function updateScrollProgress() {
  const showcase = document.querySelector(".showcase");
  const rect = showcase.getBoundingClientRect();
  const windowHeight = window.innerHeight || 1;
  const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight + rect.height)));
  showcase.style.setProperty("--scroll-progress", progress.toFixed(3));
  requestAnimationFrame(updateScrollProgress);
}

function setupBrickInteraction() {
  document.addEventListener("pointermove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 38;
    const y = (event.clientY / window.innerHeight - 0.5) * -24;
    brick.style.setProperty("--ry", `${-28 + x}deg`);
    brick.style.setProperty("--rx", `${-18 + y}deg`);
  });

  spinButton.addEventListener("click", () => {
    brick.animate(
      [
        { transform: "rotateX(-18deg) rotateY(-28deg)" },
        { transform: "rotateX(-18deg) rotateY(332deg)" }
      ],
      { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });
}

function animateGameGuide() {
  const boardWidth = gameBoard.clientWidth;
  moverX += moverDirection * 2.4;
  if (moverX > boardWidth - 120 || moverX < 16) moverDirection *= -1;
  guide.style.left = `${moverX}px`;
  gameAnimation = requestAnimationFrame(animateGameGuide);
}

function dropGameBrick() {
  const boardRect = gameBoard.getBoundingClientRect();
  const brickEl = document.createElement("span");
  brickEl.className = "game-brick";
  const x = Math.max(4, Math.min(moverX - 52, boardRect.width - 108));
  const y = boardRect.height - 45 - brickCount * 34;
  const center = boardRect.width / 2;
  const accuracy = Math.max(0, 1 - Math.abs(x + 52 - center) / center);

  brickEl.style.left = `${x}px`;
  brickEl.style.top = "-40px";
  gameBoard.appendChild(brickEl);
  brickEl.animate([{ top: "-40px" }, { top: `${Math.max(22, y)}px` }], {
    duration: 420,
    easing: "cubic-bezier(.2,.8,.2,1)",
    fill: "forwards"
  });

  brickCount += 1;
  gameScore += Math.round(100 * accuracy);
  scoreEl.textContent = gameScore;

  if (brickCount > 9) guide.textContent = "Luxury wall";
}

function resetGame() {
  gameBoard.querySelectorAll(".game-brick").forEach((el) => el.remove());
  brickCount = 0;
  gameScore = 0;
  scoreEl.textContent = "0";
  guide.textContent = "Tap to drop";
}

function setupGame() {
  gameBoard.addEventListener("click", dropGameBrick);
  resetButton.addEventListener("click", resetGame);
  cancelAnimationFrame(gameAnimation);
  animateGameGuide();
}

document.querySelector(".purchase-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "Order submitted";
  setTimeout(() => {
    button.textContent = "Place order";
  }, 1600);
});

makeVideoLoop();
setupReveal();
setupBrickInteraction();
setupGame();
updateScrollProgress();
