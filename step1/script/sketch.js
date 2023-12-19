let circles = []; // 마우스를 움직였을때 색상전환이 되면서 멈추는 모션은 챗gpt를 활용하여 작업하였습니다.
let prevMouseX;
let prevMouseY;
let canvasScale = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function draw() {
  background(0);

  // 마우스 위치에 따라 다양한 크기의 원 생성
  let circle = new Circle(mouseX, mouseY, prevMouseX, prevMouseY);
  circles.push(circle);

  // 생성된 모든 원을 업데이트하고 표시
  for (let i = circles.length - 1; i >= 0; i--) {
    circles[i].update();
    circles[i].display();
    if (circles[i].isFinished()) {
      circles.splice(i, 1);
    }
  }

  // 현재 마우스 위치를 저장
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

class Circle {
  constructor(x, y, prevX, prevY) {
    this.x = x;
    this.y = y;
    this.radius = dist(x, y, prevX, prevY); // 마우스 이동 거리에 따라 크기 설정
    this.color = color(random(255), random(255), random(255), 150);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.alpha = 255;
    this.flashDuration = 10; // 번쩍이는 효과의 지속 시간
    this.flashFrame = 0; // 현재 프레임에서의 번쩍이는 효과 지속 시간
  }

  update() {
    if (this.flashFrame > 0) {
      this.flashFrame--;
      this.color = color(255, 255, 255); // 번쩍이는 효과의 색상
    } else {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.alpha -= 1;
      this.color = color(random(255), random(255), random(255), 150);
    }
  }

  display() {
    fill(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      this.alpha
    );
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  isFinished() {
    return this.alpha <= 0;
  }

  flash() {
    this.flashFrame = this.flashDuration;
  }
}

function mouseMoved() {
  for (let i = 0; i < circles.length; i++) {
    circles[i].flash();
  }
}

function windowResized() {
  setCanvas();
}

function setCanvas() {
  canvasScale = min(windowWidth / 800, windowHeight / 600);
  resizeCanvas(800 * canvasScale, 600 * canvasScale);
}
