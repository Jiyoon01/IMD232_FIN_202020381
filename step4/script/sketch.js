let bolts = []; // 'update' 메서드에서 'lerp' 함수를 사용하여 전기의 끝점을 부드럽게 마우스 우치로 이동시키고 'display' 메서드에서 'noise' 함수를 활용하여전기의 각 세그먼트에 일정한 랜덤한 변위를 주어 전기의 불안정한 모양을 표현하고자 하였습니다.
// 'lerp' 함수는 선형 보간을 수행하여 현재 값과 목표 값을 주어진 비율에 따라 중간 값으로 이동시키는 데 사용됩니다.
// 전기의 움직임을 표현하는 부분은 챗gpt의 도움을 받아 작업하였습니다.

let particles = [];
let canvasScale = 1;

function setup() {
  setCanvas();
  createCanvas(windowWidth, windowHeight);
  strokeWeight(3);
}

function draw() {
  background(0);

  // 전기 업데이트 및 그리기
  for (let i = bolts.length - 1; i >= 0; i--) {
    bolts[i].update();
    bolts[i].display();
    if (bolts[i].isFinished()) {
      bolts.splice(i, 1);
    }
  }

  // 입자 업데이트 및 그리기
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function mouseMoved() {
  let startX = pmouseX;
  let startY = pmouseY;
  let endX = mouseX;
  let endY = mouseY;
  createLightning(startX, startY, endX, endY);
}

function createLightning(startX, startY, endX, endY) {
  let bolt = new LightningBolt(startX, startY, endX, endY);
  bolts.push(bolt);

  // 전기가 번쩍일 때 입자 생성
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(bolt.segments[0].x, bolt.segments[0].y));
  }
}

class LightningBolt {
  constructor(startX, startY, endX, endY) {
    this.segments = [];
    this.segments.push(createVector(startX, startY));
    this.segments.push(createVector(endX, endY));
    this.life = 50; // 전기의 지속 시간
    this.color = color(random(255), random(255), random(255), 150); // 랜덤한 색상
  }

  update() {
    if (this.life > 0) {
      let lastSegment = this.segments[this.segments.length - 1];
      let newX = lerp(lastSegment.x, mouseX, 0.1);
      let newY = lerp(lastSegment.y, mouseY, 0.1);
      this.segments.push(createVector(newX, newY));
      this.life--;
    }
  }

  display() {
    for (let i = 0; i < this.segments.length - 1; i++) {
      let x1 = this.segments[i].x + noise(i) * 5;
      let y1 = this.segments[i].y + noise(i) * 5;
      let x2 = this.segments[i + 1].x + noise(i) * 5;
      let y2 = this.segments[i + 1].y + noise(i) * 5;

      stroke(
        this.color.levels[0],
        this.color.levels[1],
        this.color.levels[2],
        this.color.levels[3]
      );
      line(x1, y1, x2, y2);
    }
  }

  isFinished() {
    return this.life <= 0;
  }
}

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(random(1, 5));
    this.acceleration = createVector(0, 0.2);
    this.lifespan = 255;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }

  display() {
    noStroke();
    fill(255, this.lifespan); // 흰색
    ellipse(this.position.x, this.position.y, 5, 5);
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}

function windowResized() {
  setCanvas();
}

function setCanvas() {
  canvasScale = min(windowWidth / 800, windowHeight / 600);
  resizeCanvas(800 * canvasScale, 600 * canvasScale);
}
