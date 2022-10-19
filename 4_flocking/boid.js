class Boid {
  constructor() {
      this.position = createVector(random(2*width/5, 3*width/5), random(2*height/5, 3*height/5));
      this.velocity = p5.Vector.random2D();
      this.velocity.setMag(random(1, 2.5));
      this.acceleration = createVector();
      this.maxForce = 0.2;
      this.maxSpeed = 2;
      this.sz = random(5, 12);
      this.a = Math.round(random(1, 11));
      this.b = Math.round(random(1, 11));
      this.red = random(150, 255)
      this.green = random(80, 255);
      this.blue = random(290,255);
      this.alpha = random(240,255);
  }
  
  edges() {
      if (this.position.x > width) {
          this.position.x = 0;
      } else if (this.position.x < 0) {
          this.position.x = width;
      }
      if (this.position.y > height) {
          this.position.y = 0;
      } else if (this.position.y < 0) {
          this.position.y = height;
      }
  }
  
  align(boids) {
      let perceptionRadius = 50;
      let perceptionCount = 5;
      let steering = createVector();
      let total = 0;
      for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
          steering.add(other.velocity);
          total++;
      }
      if (total > 0) {
          steering.div(total);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
      }
      return steering;
  }
  
  separation(boids) {
      let perceptionRadius = 50;
      let perceptionCount = 5;
      let steering = createVector();
      let total = 0;
      for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
          const diff = p5.Vector.sub(this.position, other.position);
          const d = diff.mag();
          if (d === 0) continue;
          diff.div(d * d);
          steering.add(diff);
          total++;
      }
      if (total > 0) {
          steering.div(total);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
      }
      return steering;
  }
  
  cohesion(boids) {
      let perceptionRadius = 80;
      let perceptionCount = 5;
      let steering = createVector();
      let total = 0;
      for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
          steering.add(other.position);
          total++;
      }
      if (total > 0) {
          steering.div(total);
          steering.sub(this.position);
          steering.setMag(this.maxSpeed);
          steering.sub(this.velocity);
          steering.limit(this.maxForce);
      }
      return steering;
  }
  
  flock(boids) {
      let alignment = this.align(boids);
      let cohesion = this.cohesion(boids);
      let separation = this.separation(boids);
      
      alignment.mult(controls.align);
      cohesion.mult(controls.cohesion);
      separation.mult(controls.separation);
      
      this.acceleration.add(alignment);
      this.acceleration.add(cohesion);
      this.acceleration.add(separation);
  }
  
  update() {
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.acceleration.mult(0);
  }
  
  show() {
      let theta = this.velocity.heading() + PI / 2;
      let size =  width * 0.2 / 10 * 0.2 * 0.2;
      stroke(this.red, this.green , 166, 255);
      strokeWeight(1.5);
      noFill();
      push();
      translate(this.position.x, this.position.y)
      rotate(theta);
      beginShape();
      for (let i = 0; i <= 360; i=i+1.5) {
          let nextx, nexty;
          let t = map(i, 0, 360, 0, TWO_PI);
          nextx = this.sz * size * ( sin(this.a*t) + sin( Math.sign(this.a-this.b)*this.b*t ) + sin(controls.n * t));
          nexty = this.sz * size *( cos(this.a*t) + cos( Math.sign(this.a-this.b)*this.b*t  ) + cos(controls.n *t ));
          vertex(nextx, nexty);
      }
      endShape();
      pop();
  }
}
