const circle = document.getElementById("circle");
    const scoreEl = document.getElementById("score");
    const messageEl = document.getElementById("message");
    const gameArea = document.getElementById("gameArea");
    const restartBtn = document.getElementById("restartBtn");
    const startBtn = document.getElementById("startBtn");
    const timerEl = document.getElementById("timer");
    const hearts = document.getElementById("hearts").children;

    let score = 0;
    let missCount = 0;
    let gameEnded = true;
    let gameStartTime;
    let timerInterval;
    let circleClickCount = 0;
    let sizes = [50, 60, 70];

    function getRandomPosition() {
      const areaWidth = gameArea.clientWidth;
      const areaHeight = gameArea.clientHeight;
      const circleSize = circle.clientWidth;

      const maxX = areaWidth - circleSize - 4;
      const maxY = areaHeight - circleSize - 4;

      const x = Math.max(2, Math.floor(Math.random() * maxX));
      const y = Math.max(2, Math.floor(Math.random() * maxY));

      return { x, y };
    }

    function moveAndStyleCircle() {
      if (gameEnded) return;

      const pos = getRandomPosition();
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      circleClickCount++;
      if (circleClickCount % 5 === 0 && size > 40) {
        sizes = sizes.map(s => Math.max(s - 2, 40));
      }

      circle.style.width = size + "px";
      circle.style.height = size + "px";
      circle.style.left = pos.x + "px";
      circle.style.top = pos.y + "px";
    }

    function updateHearts() {
      if (missCount <= 5) {
        for (let i = 0; i < 5; i++) {
          hearts[i].style.opacity = i < missCount ? "0.2" : "1";
        }
      }
    }

    function updateTimer() {
      const now = new Date();
      const elapsed = Math.floor((now - gameStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      timerEl.textContent = `${minutes}:${seconds}`;
    }

    function gameOver() {
      gameEnded = true;
      clearInterval(timerInterval);
      messageEl.innerHTML = `Game over! Your score: <span class="font-bold">${score}</span>`;
      circle.style.display = "none";
      restartBtn.classList.remove("hidden");
      startBtn.classList.add("hidden");
    }

    function startGame() {
      score = 0;
      missCount = 0;
      circleClickCount = 0;
      gameEnded = false;
      sizes = [50, 60, 70];

      scoreEl.textContent = score;
      messageEl.textContent = "Game started! Click the circles!";
      circle.style.display = "flex";
      restartBtn.classList.add("hidden");
      startBtn.classList.add("hidden");

      for (let i = 0; i < 5; i++) {
        hearts[i].style.opacity = "1";
      }

      gameStartTime = new Date();
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();

      moveAndStyleCircle();
    }

    circle.addEventListener("click", (e) => {
      if (gameEnded) return;

      e.stopPropagation();
      score++;
      scoreEl.textContent = score;

      circle.classList.add("active");
      setTimeout(() => {
        circle.classList.remove("active");
        moveAndStyleCircle();
      }, 150);
    });

    gameArea.addEventListener("click", () => {
      if (gameEnded) return;

      missCount++;
      updateHearts();
      if (missCount >= 5) {
        gameOver();
      }
    });

    restartBtn.addEventListener("click", startGame);
    startBtn.addEventListener("click", startGame);