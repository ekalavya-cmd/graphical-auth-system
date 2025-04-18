// Image-based Layer (register2.html, login2.html)
function initImageCanvas(
  canvasId,
  inputId,
  imageSrc = "/image.jpg",
  errorDivId = "error-message"
) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => ctx.drawImage(img, 0, 0, 600, 400);
  let points = [];
  const errorDiv = document.getElementById(errorDivId);

  canvas.addEventListener("click", (e) => {
    if (errorDiv && errorDiv.textContent) errorDiv.textContent = ""; // Clear error on first click
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    points.push({ x, y });
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    document.getElementById(inputId).value = JSON.stringify(points);
  });

  return {
    clear: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 600, 400);
      points = [];
      document.getElementById(inputId).value = "";
      if (errorDiv) errorDiv.textContent = ""; // Clear error on clear
    },
  };
}

// Color-based Layer (register3.html, login3.html) - Color Wheel
function initColorWheel(
  canvasId,
  selectedId,
  inputId,
  errorDivId = "error-message"
) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  // Original colors array
  const originalColors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "cyan",
    "magenta",
    "lime",
    "pink",
    "teal",
    "brown",
  ];
  // Shuffle the colors array initially
  let colors = [...originalColors];
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]]; // Swap elements
  }
  let selectedColors = [];
  let hoveredIndex = -1;
  let animationFrameId = null;
  const errorDiv = document.getElementById(errorDivId);

  // Draw color wheel with animation
  function drawWheel(targetRadius = 20, duration = 200) {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    const startTime = performance.now();
    const startRadius = targetRadius === 24 ? 20 : 24;
    const isExpanding = targetRadius === 24;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      const currentRadius = isExpanding
        ? startRadius + (targetRadius - startRadius) * easedProgress
        : startRadius - (startRadius - targetRadius) * easedProgress;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      colors.forEach((color, index) => {
        const angle = (index / colors.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const isHovered = index === hoveredIndex;
        ctx.beginPath();
        ctx.arc(x, y, isHovered ? currentRadius : 20, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }
    animate(performance.now());
  }
  drawWheel();

  // Easing function for smooth transition
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Hover effect with smooth transition
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let newHoveredIndex = -1;

    colors.forEach((color, index) => {
      const angle = (index / colors.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const dist = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
      if (dist < 20) {
        newHoveredIndex = index;
      }
    });

    if (newHoveredIndex !== hoveredIndex) {
      hoveredIndex = newHoveredIndex;
      drawWheel(hoveredIndex !== -1 ? 24 : 20, 200);
    }
  });

  canvas.addEventListener("mouseleave", () => {
    if (hoveredIndex !== -1) {
      hoveredIndex = -1;
      drawWheel(20, 200);
    }
  });

  // Click to select
  canvas.addEventListener("click", (e) => {
    if (errorDiv && errorDiv.textContent) errorDiv.textContent = ""; // Clear error on first click
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    let selectedColor = null;

    colors.forEach((color, index) => {
      const angle = (index / colors.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const dist = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      if (dist < 20) {
        selectedColor = color;
      }
    });

    if (selectedColor) {
      selectedColors.push(selectedColor);
      const selectedContainer = document.getElementById(selectedId);
      selectedContainer.innerHTML = "";
      selectedColors.forEach((color) => {
        const square = document.createElement("div");
        square.className = "selected-color";
        square.style.backgroundColor = color;
        selectedContainer.appendChild(square);
      });
      document.getElementById(inputId).value = JSON.stringify(selectedColors);
    }
  });

  // Function to reshuffle colors
  function reshuffleColors() {
    colors = [...originalColors]; // Reset to original array
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]]; // Swap elements
    }
    drawWheel(); // Redraw with new order
  }

  return {
    clear: () => {
      selectedColors = [];
      document.getElementById(selectedId).innerHTML = "";
      document.getElementById(inputId).value = "";
      reshuffleColors(); // Reshuffle colors on clear
      if (errorDiv) errorDiv.textContent = ""; // Clear error on clear
    },
  };
}

// Android Pattern Layer (register4.html, login4.html)
function initPatternCanvas(canvasId, inputId, errorDivId = "error-message") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error("Canvas element not found:", canvasId);
    return;
  }
  canvas.classList.add("pattern");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2D context for canvas:", canvasId);
    return;
  }
  const gridSize = 3;
  const cellSize = 100;
  const points = [];
  let pattern = [];
  let lastPoint = null;
  const errorDiv = document.getElementById(errorDivId);

  // Initialize points with explicit calculation and debug logging
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = j * cellSize + cellSize / 2; // e.g., 50, 150, 250 for j=0,1,2
      const y = i * cellSize + cellSize / 2; // e.g., 50, 150, 250 for i=0,1,2
      points.push({ x, y, id: i * gridSize + j + 1 });
    }
  }
  console.log("Initialized points:", points); // Verify coordinates

  // Draw simple dots
  function drawDots() {
    if (!ctx) {
      console.error("Canvas context lost");
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2); // Solid dot
      ctx.fillStyle = pattern.includes(point.id) ? "#007bff" : "#ff6f61";
      ctx.fill();
      ctx.lineWidth = 2; // Add border
      ctx.strokeStyle = "#000";
      ctx.stroke();
    });

    // Redraw lines
    if (pattern.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 123, 255, 0.8)";
      ctx.lineWidth = 4;
      for (let i = 0; i < pattern.length - 1; i++) {
        const p1 = points.find((p) => p.id === pattern[i]);
        const p2 = points.find((p) => p.id === pattern[i + 1]);
        if (p1 && p2) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
      ctx.stroke();
    }
  }

  drawDots();

  // Animation loop
  function animate() {
    drawDots();
    requestAnimationFrame(animate);
  }
  animate();

  canvas.addEventListener("click", (e) => {
    if (errorDiv && errorDiv.textContent) errorDiv.textContent = ""; // Clear error
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    let closest = null;
    let minDist = Infinity;

    points.forEach((point) => {
      const dx = point.x - clickX;
      const dy = point.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist && dist < 25) {
        minDist = dist;
        closest = point;
      }
    });

    if (closest && !pattern.includes(closest.id)) {
      pattern.push(closest.id);
      drawDots();
      document.getElementById(inputId).value = JSON.stringify(pattern);
    }
  });

  return {
    clear: () => {
      pattern = [];
      document.getElementById(inputId).value = "";
      drawDots();
      if (errorDiv) errorDiv.textContent = ""; // Clear error
    },
  };
}

// Audio Sequence Layer (register5.html, login5.html)
function initAudioSequence(
  audioIds,
  selectedId,
  inputId,
  errorDivId = "error-message"
) {
  const audioFiles = [
    "/audio/keyboard.mp3",
    "/audio/click.mp3",
    "/audio/message.mp3",
    "/audio/chime.mp3",
    "/audio/notification.mp3",
  ];
  let selectedSequence = [];
  const errorDiv = document.getElementById(errorDivId);

  // Shuffle audio files initially
  function shuffleAudio() {
    const shuffled = [...audioFiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  const shuffledAudioFiles = shuffleAudio();

  // Map each audioId to its shuffled audio file
  const audioMap = {};
  audioIds.forEach((id, index) => {
    audioMap[id] = shuffledAudioFiles[index % shuffledAudioFiles.length];
  });

  audioIds.forEach((id, index) => {
    const audio = document.getElementById(id);
    audio.src = shuffledAudioFiles[index % shuffledAudioFiles.length];
    audio.style.display = "none"; // Hide the audio controls
    const label =
      audio.parentNode.querySelector(`label[for="${id}"]`) ||
      document.createElement("label");
    if (!label.parentNode) {
      label.textContent = shuffledAudioFiles[index % shuffledAudioFiles.length]
        .split("/")
        .pop()
        .replace(".mp3", "");
      label.htmlFor = id;
      label.className = "audio-label"; // Explicitly set class
      label.style.display = "inline-block";
      label.style.marginBottom = "15px";
      label.style.marginRight = "15px"; // Space between labels
      audio.parentNode.insertBefore(label, audio);
    } else {
      label.textContent = shuffledAudioFiles[index % shuffledAudioFiles.length]
        .split("/")
        .pop()
        .replace(".mp3", ""); // Ensure content
      label.className = "audio-label"; // Ensure class is applied
      label.style.display = "inline-block";
      label.style.marginRight = "15px"; // Space between labels
    }
    label.addEventListener("click", () => {
      if (errorDiv && errorDiv.textContent) errorDiv.textContent = ""; // Clear error on click
      const selectedAudio = audioMap[id];
      selectedSequence.push(selectedAudio);
      updateDisplay();
      audio.play().catch((e) => console.error("Audio play failed:", e));
    });
  });

  function updateDisplay() {
    const selectedContainer = document.getElementById(selectedId);
    selectedContainer.innerHTML = "";
    selectedSequence.forEach((audioSrc, idx) => {
      const div = document.createElement("div");
      div.textContent = `Audio ${idx + 1}: ${audioSrc
        .split("/")
        .pop()
        .replace(".mp3", "")}`;
      div.className = "selected-audio";
      div.style.margin = "5px";
      selectedContainer.appendChild(div);
    });
    document.getElementById(inputId).value = JSON.stringify(selectedSequence);
  }

  return {
    clear: () => {
      selectedSequence = [];
      document.getElementById(selectedId).innerHTML = "";
      document.getElementById(inputId).value = "";
      const shuffled = shuffleAudio(); // Reshuffle on clear
      audioIds.forEach((id, index) => {
        const audio = document.getElementById(id);
        audioMap[id] = shuffled[index % shuffled.length];
        audio.src = shuffled[index % shuffled.length];
        const label = audio.parentNode.querySelector(`label[for="${id}"]`);
        label.textContent = shuffled[index % shuffled.length]
          .split("/")
          .pop()
          .replace(".mp3", "");
      });
      if (errorDiv) errorDiv.textContent = ""; // Clear error on clear
    },
  };
}

// Text-based Layer Clear Form (register1.html, login1.html)
function clearForm() {
  document
    .querySelectorAll(
      'input[type="email"], input[type="text"], input[type="password"]'
    )
    .forEach((input) => (input.value = ""));
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) errorDiv.textContent = ""; // Clear error on clear
}

// Initialize based on page
document.addEventListener("DOMContentLoaded", () => {
  if (
    document.getElementById("image-canvas") &&
    document.getElementById("points")
  ) {
    const imageCanvas = initImageCanvas("image-canvas", "points");
    window.clearCanvas = imageCanvas.clear;
  } else if (
    document.getElementById("color-wheel") &&
    document.getElementById("colorsInput")
  ) {
    const colorWheel = initColorWheel("color-wheel", "selected", "colorsInput");
    window.clearSelection = colorWheel.clear;
  } else if (
    document.getElementById("canvas") &&
    document.getElementById("pattern")
  ) {
    const patternCanvas = initPatternCanvas("canvas", "pattern");
    window.clearPattern = patternCanvas.clear;
  } else if (
    document.getElementById("audio1") &&
    document.getElementById("audioInput")
  ) {
    const audioIds = ["audio1", "audio2", "audio3", "audio4", "audio5"];
    const audioSequence = initAudioSequence(audioIds, "selected", "audioInput");
    window.clearAudio = audioSequence.clear;
  } else if (
    document.querySelector('input[type="email"], input[type="password"]')
  ) {
    window.clearForm = clearForm;
  }
});
