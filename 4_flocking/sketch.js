const flock = [];

let Controls = function() {
  this.align = 1.2;
  this.cohesion = 0.7;
  this.separation = 2;
  this.numPoly = 50;
  this.n = 4;
};

let controls = new Controls();

let quadTree;

function setup() {
  createCanvas(windowWidth, windowHeight);

  quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));

  // create gui (dat.gui)
  let gui = new dat.GUI({
    width: 295
  });
  gui.close();
  gui.add(controls, 'align', 0, 2.5).name("Alignment").step(0.1);
  gui.add(controls, 'cohesion', 0, 2.5).name("Cohesion").step(0.1);
  gui.add(controls, 'separation', 0, 2.5).name("Separation").step(0.1);
  gui.add(controls, 'numPoly', 0, 80).name("Num Creatures").step(1);
  gui.add(controls, 'n', -10, 10).name("Shapes").step(1);
  gui.add(this, 'infoBoids').name("Boids Info");
  //gui.add(this, 'sourceCode').name("Source Code");
  // gui.add(this, 'backHome').name("Visit my site");

  for (let i = 0; i < controls.numPoly; i++) {
    pushRandomBoid(); //flock.push(new Boid());
  }

}

function infoBoids() {
  window.open(
    'https://www.red3d.com/cwr/boids/',
    '_blank' // <- This is what makes it open in a new window.
  );
}


function backHome() {
  window.open(
    'https://jcponce.github.io/flocking',
    '_blank' // <- This is what makes it open in a new window.
  );
}

function draw() {

  background(0);

  quadTree.clear();
  for (const boid of flock) {
    quadTree.addItem(boid.position.x, boid.position.y, boid);
  }

  quadTree.debugRender();


  noFill();
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  // Adjust the amount of boids on screen according to the slider value
  let maxBoids = controls.numPoly;
  let difference = flock.length - maxBoids;
  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      pushRandomBoid(); // Add boids if there are less boids than the slider value
    }
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      flock.pop(); // Remove boids if there are more boids than the slider value
    }
  }
}

// Make a new boid
function pushRandomBoid() {
  let boid = new Boid(); // Create a new boid
  flock.push(boid); // Add the new boid to the flock
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}