class HandParticle extends  VerletParticle2D  {
    constructor(x, y) {
      super(x, y);
      physics.addParticle(this);
    }
  
    updatePosition(x, y) {
      this.set(x, y);
    }

    getParticle(){
        return this;
    }
  }
  