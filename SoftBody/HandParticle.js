class HandParticle extends  VerletParticle2D  {
    constructor(x, y) {
      super(x, y);
      physics.addParticle(this);
    }
  
    updatePosition(x, y) {
      this.set(x, y);
    }

    getPosition(){
      return this;
    }

    updateAttraction(attraction) {
      attraction.setAttractor(this);
    }

  }
  