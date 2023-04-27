
class ParticleString {
  constructor(physics, startPosition, stepDirection, numParticles, strength, damping) {
    this.particles = [];
    this.springs = [];

    for (let i = 0; i < numParticles; i++) {
      const particle = new toxi.physics2d.VerletParticle2D(startPosition.add(stepDirection.scale(i)));
      physics.addParticle(particle);
      this.particles.push(particle);

      if (i > 0) {
        const prevParticle = this.particles[i - 1];
        const spring = new toxi.physics2d.VerletSpring2D(prevParticle, particle, stepDirection.magnitude(), strength);

        spring.damping = damping;
        physics.addSpring(spring);
        this.springs.push(spring);
      }
    }
  }

  display() {
    stroke(255, 150);
    strokeWeight(2);
    noFill();

    beginShape();
    for (const particle of this.particles) {
      vertex(particle.x, particle.y);
    }
    endShape();

    fill(255,50);
    for (const particle of this.particles) {
      ellipse(particle.x, particle.y, 7, 7);
    }
  }
}