let particles = [];
let canvasScale = 1;

function setup() {
  setCanvas();
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 20);

  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      let p = new Particle(mouseX / canvasScale, mouseY / canvasScale);
      particles.push(p);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 50);
    this.color = color(random(360), 80, 80, 0.7);
    this.velocity = p5.Vector.random2D().mult(random(2, 5));
    this.life = 255;
    this.waveFrequency = random(0.01, 0.1);
  }

  update() {
    let target = createVector(mouseX / canvasScale, mouseY / canvasScale);
    let dir = p5.Vector.sub(target, createVector(this.x, this.y));
    dir.normalize();
    dir.mult(0.5);
    this.velocity.add(dir);

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life -= 1;
  }

  display() {
    noFill();
    stroke(this.color);
    beginShape();
    for (let i = 0; i < 360; i += 10) {
      let radius =
        this.size * sin((frameCount - this.life) * this.waveFrequency);
      let angle = radians(i);
      let xPos = this.x + radius * cos(angle);
      let yPos = this.y + radius * sin(angle);
      vertex(xPos, yPos);
    }
    endShape(CLOSE);
  }

  isFinished() {
    return this.life <= 0;
  }
}

function windowResized() {
  setCanvas();
}

function setCanvas() {
  canvasScale = min(windowWidth / 800, windowHeight / 600);
  resizeCanvas(800 * canvasScale, 600 * canvasScale);
}
