let particles = [];
let springs = [];
let spacing = 50;
let k = 0.1;

let gravity;

const NOBODY = "nobody";
let selected = NOBODY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    particles[i] = new Particle(width / 2, i * spacing);
    if (i !== 0) {
      let a = particles[i];
      let b = particles[i - 1];
      let spring = new Spring(k, spacing, a, b);
      springs.push(spring);
    }
  }

  particles[0].locked = true;

  gravity = createVector(0, 0.1);
}

function draw() {
  background(112, 50, 126);

  for (let s of springs) {
    s.update();
    //s.show();
  }

  beginShape();
  let head = particles[0];
  curveVertex(head.position.x, head.position.y);
  for (let p of particles) {
    p.applyForce(gravity);
    p.update();
    curveVertex(p.position.x, p.position.y);
  }
  let tail = particles[particles.length - 1];
  curveVertex(tail.position.x, tail.position.y);
  
  noFill();
  stroke(252, 238, 33);
  strokeWeight(8);
  endShape();
  
  for (const p of particles) {
    // p.show();
  }

  fill(45, 197, 244);
  ellipse(tail.position.x, tail.position.y, 64);

  // if (mouseIsPressed) {
  //   tail.position.set(mouseX, mouseY);
  //   tail.velocity.set(0, 0);
  // }

  if (selected != NOBODY && !selected.locked) {
    selected.position.set(mouseX, mouseY);
    selected.velocity.set(0, 0);
  }

}

function mousePressed() {
  const mousePos = createVector(mouseX, mouseY);
  const nearest = particles
    .filter(p =>
      myDistFunction(mousePos, p.position) < 50
    )
    .sort((a, b) =>
      myDistFunction(mousePos, b.position) -
      myDistFunction(mousePos, a.position)
    )[0];

  if (nearest) {
    selected = nearest;
    nearest.color = color(255, 0, 0, 255);
  }
}

function mouseReleased() {
  selected.color = color(0, 0);
  selected = NOBODY;
}

// Beautifull !
const myDistFunction = (v1, v2) =>
  dist(v1.x, v1.y, v2.x, v2.y);