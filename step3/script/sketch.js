let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 25);

  // 업데이트 및 표시
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].display();
    if (fireworks[i].isFinished()) {
      fireworks.splice(i, 1);
    }
  }
}

function mouseMoved() {
  // 마우스 이동 시 '팡팡' 터지는 효과 추가
  let firework = new Firework(mouseX, mouseY);
  fireworks.push(firework);
}

class Particle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.size = random(2, 8); // 파티클 크기
    this.velocity = createVector(random(-2, 2), random(-10, -5));
    this.gravity = createVector(0, 0.2);
    this.alpha = 255;
  }

  update() {
    this.velocity.add(this.gravity);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 3;
  }

  display() {
    colorMode(HSB);
    noStroke();
    fill(this.hue, 255, 255, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hue = random(360);
    this.particles = [];

    // 폭죽 생성 시 초기 파티클 추가
    for (let i = 0; i < 100; i++) {
      let particle = new Particle(this.x, this.y, this.hue);
      this.particles.push(particle);
    }
  }

  update() {
    // 파티클 업데이트
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  display() {
    // 파티클 표시
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }

  isFinished() {
    return this.particles.length === 0;
  }
}

function windowResized() {
  setCanvas();
}

function setCanvas() {
  canvasScale = min(windowWidth / 800, windowHeight / 600);
  resizeCanvas(800 * canvasScale, 600 * canvasScale);
}
