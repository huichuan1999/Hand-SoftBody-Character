//------- Condortable p5 world :))))) -------//
//hand points: https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection#mediapipe-hands-keypoints-used-in-mediapipe-hands
//thread: http://haptic-data.com/toxiclibsjs/examples/thread 
//soft body character: https://thecodingtrain.com/challenges/177-soft-body-character 

let canvas;
let isLoadedBothHands = false;

const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

let particles = [];
let springs = [];

// 根据实际情况调整捏合阈值
const pinchThreshold = 30;
let physics;

//soft body character
let eyes = [];
let tail;
let particleStrings = [];
let physicTail;
const associatedVertices = [5, 6, 8];
//const associatedVertices = Array.from({ length: 16 }, (_, i) => i);

//flower
//let physics;
let draggedParticle = null;
let centerParticle;
let particleGrabRadius = 30;

let handParticles = [];
let handAttractions = [];

function setup() {
  let canvasWidth = 1920;
  let canvasHeight = 1080;
  frameRate(60);

  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.id("canvas");

  colorMode(HSB, 255);
  //rectMode(CENTER);

   createCharacter();
 // createSymmetricalFlower();

}

function draw() {
  clear();

  //draw landmarks
  if (detections != undefined) {
    if (detections.multiHandLandmarks != undefined) {

      //当4与8的距离过近，以8的位置作为触发交互的位置

      // drawLines([4, 5, 0]);
      // drawLines([8, 7, 6, 5]);
      // drawLines([12, 11, 5]);
      // drawLines([16, 15, 14, 9, 0]);
      // drawLines([20, 19, 13, 0]);

      // let s = sin(frameCount * 0.01);
      // let cHue = map(s, -1, 1, 0, 255)
      // drawTestC([4, 4], cHue, 30);
      // drawTestC([8, 8], cHue, 50);
      // drawTestC([12, 12], cHue, 70);
      // drawTestC([16, 16], cHue, 50);
      // drawTestC([20, 20], cHue, 30);

      //drawHands();
      // drawParts();

      drawLines([0, 5, 9, 13, 17, 0]);//palm
      drawLines([0, 1, 2, 3, 4]);//thumb
      drawLines([5, 6, 7, 8]);//index finger
      drawLines([9, 10, 11, 12]);//middle finger
      drawLines([13, 14, 15, 16]);//ring finger
      drawLines([17, 18, 19, 20]);//pinky

      drawLandmarks([0, 1], 0);//palm base

      drawLandmarks([1, 5], 60);//thumb

      drawLandmarks([5, 9], 120);//index finger
      drawLandmarks([9, 13], 180);//middle finger
      drawLandmarks([13, 17], 240);//ring finger
      drawLandmarks([17, 21], 300);//pinky

      // drawTest([8,9],200);

      // drawTestB([0,1,2,3,4,8,12,16,20,19,18,17,0,17,0],200);
      // drawTestB([3,4,8,7,3],0);
      // drawTestB([7,8,12,11,7],30);
      // drawTestB([11,12,16,15,11],60);
      // drawTestB([15,16,20,19,15],90);
      // drawTestB([0,1,2,3,6,9,14,17,0],90);

      // rect(imgPosX,imgPosY,imgSizeX,imgSizeY)

      //drawHandsTest();

      // drawLines([4,8,12,16,20]);
      // drawLines([4,7,12,15,20]);
      //  drawLines([3,8,11,16,19]);
    }
  }

  drawSoftBodyCharacter();
 // drawSymmertricalFlower();
}

function createCharacter() {

  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));
  // // 创建柔性边界粒子
  // const boundaryParticles = [
  //   new VerletParticle2D(new Vec2D(width / 2, -50)),
  //   new VerletParticle2D(new Vec2D(width / 2, height + 50)),
  //   new VerletParticle2D(new Vec2D(-50, height / 2)),
  //   new VerletParticle2D(new Vec2D(width + 50, height / 2)),
  // ];

  // // 将边界粒子添加到物理系统中
  // for (const boundaryParticle of boundaryParticles) {
  //   physics.addParticle(boundaryParticle);
  //   boundaryParticle.lock(); // 锁定边界粒子，防止它们移动
  // }

  const boundarySpringCoefficient = 0.1; // 调整这个值以改变边界回弹力度

  // 创建弹簧并将它们添加到物理系统中
  for (const particle of particles) {
    for (const boundaryParticle of boundaryParticles) {
      const distance = particle.distanceTo(boundaryParticle);
      const spring = new VerletSpring2D(particle, boundaryParticle, distance, boundarySpringCoefficient);
      physics.addSpring(spring);
    }
  }

  physicTail = new VerletPhysics2D();
  physicTail.setWorldBounds(new Rect(0, 0, width, height));

  //把关键点全都写上去，在这里画我的怪东西

  particles.push(new Particle(280, 145));//0
  particles.push(new Particle(390, 120));//1
  particles.push(new Particle(395, 228));//2
  particles.push(new Particle(340, 228));//3
  particles.push(new Particle(420, 350));//4
  particles.push(new Particle(390, 400));//5
  particles.push(new Particle(320, 380));//6
  particles.push(new Particle(300, 350));//7
  particles.push(new Particle(255, 400));//8
  particles.push(new Particle(222, 350));//9
  particles.push(new Particle(300, 228));//10
  particles.push(new Particle(248, 228));//11
  particles.push(new Particle(248, 120));//12
  particles.push(new Particle(280, 120));//13

  //eyes
  eyes.push(new Particle(300, 200));
  eyes.push(new Particle(360, 200));

  //弹簧绕表面一圈
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (i !== j) {
        let a = particles[i];
        let b = particles[j];
        // let b = particles[(i + 1) % particles.length];
        springs.push(new Spring(a, b, 0.1));
      }
    }
  }

  for (let particle of particles) {
    springs.push(new Spring(particle, eyes[0], 0.1));
    springs.push(new Spring(particle, eyes[1], 0.1));
  }

  //set up tails
  const stepDirection = new toxi.geom.Vec2D(1, 1).normalizeTo(10);
  // 创建 ParticleString 对象数组
  for (let i = 0; i < associatedVertices.length; i++) {
    const particleString = new ParticleString(physicTail, new toxi.geom.Vec2D(), stepDirection, 125, 1, 0.1);
    particleString.particles[0].lock();
    tail = particleString.particles[particleString.particles.length - 1];
    particleStrings.push(particleString);
  }
}

function drawSoftBodyCharacter() {
  //draw soft body
  
  fill(255, 150);
  stroke(255);
  strokeWeight(2);

  //draw shape
  beginShape();
  for (let particle of particles) {
    vertex(particle.x, particle.y);
  }
  endShape(CLOSE);

  eyes[0].show();
  eyes[1].show();

  // 画会动的形状
  // beginShape();
  // for (let i = 0; i < physics.particles.length; i++) {
  //   let particle = physics.particles[i];

  //   // 动态形状
  //   let adjustedX = particle.x;
  //   let adjustedY = particle.y + 10 * Math.sin(frameCount * 0.5 + i * 0.5);

  //   vertex(adjustedX, adjustedY);
  // }
  // endShape(CLOSE);

  //   for (let particle of particles) {
  //     particle.show();
  //   }
  //   for (let spring of springs) {
  //     spring.show();
  //   }

  //draw tail
  // 更新 ParticleString 的起点以跟随多边形顶点
  for (let i = 0; i < associatedVertices.length; i++) {
    const vertexIndex = associatedVertices[i];
    particleStrings[i].particles[0].set(particles[vertexIndex]);
  }
  // 显示所有 ParticleString
  for (const particleString of particleStrings) {
    particleString.display();
  }

  //如果探测到手

  //如果探测到手
  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);
  for (let i = 0; i < handParticles.length; i++) {
    const index = allLandmarkIndices[i];
    if (index == 8 || index == 4) {
      continue; // 跳过索引为 8 或 4 的关键点
    }
    const coord = allLandmarkCoordinates[index];
    //handParticles[i].updatePosition(coord.x, coord.y);
    if (coord) {
      handParticles[i].updatePosition(coord.x, coord.y);
    }
  }

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }

  for (let i = 0; i < handParticles.length; i++) {
    handAttractions[i].attractor.set(handParticles[i].getPosition());
    // 将排斥力应用于花朵粒子
      physics.addBehavior(handAttractions[i]);
  }

  // if (handParticles.length === 0) {
  //   addHandParticle(allLandmarkCoordinates);
  // }
  // //console.log(handParticles.length);

  // // 为手部粒子创建排斥力
  // for (const handParticle of handParticles) {
  //   const attraction = new toxi.physics2d.behaviors.AttractionBehavior(handParticle, 10, -0.2, 0);
  //   // 将排斥力应用于花朵粒子
  //   for (let flowerParticle of particles) {
  //     physics.addBehavior(attraction);
  //   }
  // }

  physics.update();
  physicTail.update();

  const landmarkIndices = [8, 4];
  const landmarkCoordinates = getLandmarkCoordinates(landmarkIndices, detections);

  if (landmarkCoordinates[8] && landmarkCoordinates[4]) {
    const distance = calculateDistance(landmarkCoordinates[8], landmarkCoordinates[4]);

    if (distance < pinchThreshold) {
      // 捏合动作发生
      const midpoint = {
        x: (landmarkCoordinates[8].x + landmarkCoordinates[4].x) / 2,
        y: (landmarkCoordinates[8].y + landmarkCoordinates[4].y) / 2
      };

      fill(255, 0, 0);
      noStroke();
      ellipse(midpoint.x, midpoint.y, 20, 20);
      particles[1].lock();
      particles[1].x = midpoint.x;
      particles[1].y = midpoint.y;
      particles[1].unlock();
    }
  }
}

function createSymmetricalFlower() {
  let nPetals = 16;
  let angleStep = TWO_PI / nPetals;
  let radius = 120;
  let centerX = width / 2;
  let centerY = height / 2;

  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0, 0, width, height));

  physicTail = new VerletPhysics2D();
  physicTail.setWorldBounds(new Rect(0, 0, width, height));

  centerParticle = new VerletParticle2D(new Vec2D(centerX, centerY));
  physics.addParticle(centerParticle);
  particles.push(centerParticle);

  for (let i = 0; i < nPetals; i++) {
    let angle = i * angleStep;
    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);
    let particle = new VerletParticle2D(new Vec2D(x, y));
    particles.push(particle);
    physics.addParticle(particle);

    let centerSpring = new VerletSpring2D(centerParticle, particle, radius, 0.01);
    springs.push(centerSpring);
    physics.addSpring(centerSpring);

    if (i > 0) {
      let spring = new VerletSpring2D(particles[i + 1], particles[i], 2 * radius * sin(angleStep / 2), 0.1);
      springs.push(spring);
      physics.addSpring(spring);
    }
  }
  // 添加内部支撑
  for (let i = 1; i <= nPetals; i++) {
    for (let offset = 6; offset <= nPetals / 2; offset++) {
      const j = ((i + offset - 1) % nPetals) + 1;
      const spring = new VerletSpring2D(
        particles[i],
        particles[j],
        particles[i].distanceTo(particles[j]),
        0.1
      );
      springs.push(spring);
      physics.addSpring(spring);
    }
  }

  let lastSpring = new VerletSpring2D(particles[1], particles[nPetals], 2 * radius * sin(angleStep / 2), 0.1);
  springs.push(lastSpring);
  physics.addSpring(lastSpring);

  //set up tails
  const stepDirection = new toxi.geom.Vec2D(1, 1).normalizeTo(20);
  // 创建 ParticleString 对象数组
  for (let i = 0; i < associatedVertices.length; i++) {
    const particleString = new ParticleString(physicTail, new toxi.geom.Vec2D(), stepDirection, random(50, 100), 1, 0.5);
    particleString.particles[0].lock();
    tail = particleString.particles[particleString.particles.length - 1];
    particleStrings.push(particleString);
  }

}

function drawSymmertricalFlower() {
  // Draw petals
  fill(255, 120);
  stroke(255, 100);
  strokeWeight(16);
  beginShape();
  for (let i = 1; i < particles.length; i++) {
    vertex(particles[i].x, particles[i].y);
  }
  endShape(CLOSE);

  stroke(255);
  strokeWeight(1);
  for (let spring of springs) {
    line(spring.a.x, spring.a.y, spring.b.x, spring.b.y);
  }

  for (let particle of particles) {
    stroke(255);
    strokeWeight(1);
    //noFill();
    fill(255, 70);

    ellipse(particle.x, particle.y, 50, 40);
    ellipse(particle.x, particle.y, 40, 50);

    noStroke();
    ellipse(particle.x, particle.y, 20, 20);
  }

  //draw tails
  // 更新 ParticleString 的起点以跟随多边形顶点
  for (let i = 0; i < associatedVertices.length; i++) {
    const vertexIndex = associatedVertices[i];
    particleStrings[i].particles[0].set(particles[vertexIndex]);
  }
  // 显示所有 ParticleString
  for (const particleString of particleStrings) {
    particleString.display();
  }

  // 如果探测到手


  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);
  
  // if (handParticles.length === 0) {
  //   addHandParticle(allLandmarkCoordinates);
  // }

  // for (let i = 0; i < handParticles.length; i++) {
  //   const index = allLandmarkIndices[i];
  //   if (index == 8 || index == 4) {
  //     continue; // 跳过索引为 8 或 4 的关键点
  //   }
  //   const coord = allLandmarkCoordinates[index];

  //   // 移除旧的 AttractionBehavior
  //   physics.removeBehavior(handAttractions[i]);

  //   // 更新手部粒子的 AttractionBehavior 对象的位置
  //   handAttractions[i].setAttractor(handParticles[i]);
  //   if (coord) {
  //     handParticles[i].updatePosition(coord.x, coord.y);
  //   }

  //   // 添加更新后的 AttractionBehavior
  //   physics.addBehavior(handAttractions[i]);
  // }

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }
  console.log(handParticles.length);

  // 为手部粒子创建排斥力
  for (const handParticle of handParticles) {
    const attraction = new toxi.physics2d.behaviors.AttractionBehavior(handParticle, 10, -0.2, 0);
    // 将排斥力应用于花朵粒子
    for (let flowerParticle of particles) {
      physics.addBehavior(attraction);
    }
  }

  physics.update();
  physicTail.update();

  //添加捏合交互
  const landmarkIndices = [8, 4];
  const landmarkCoordinates = getLandmarkCoordinates(landmarkIndices, detections);

  if (landmarkCoordinates[8] && landmarkCoordinates[4]) {
    const distance = calculateDistance(landmarkCoordinates[8], landmarkCoordinates[4]);

    if (distance < pinchThreshold) {
      // 捏合动作发生
      const midpoint = {
        x: (landmarkCoordinates[8].x + landmarkCoordinates[4].x) / 2,
        y: (landmarkCoordinates[8].y + landmarkCoordinates[4].y) / 2
      };
      fill(255, 0, 0);
      noStroke();
      ellipse(midpoint.x, midpoint.y, 20, 20);

      for (let particle of particles) {
        let d = dist(midpoint.x, midpoint.y, particle.x, particle.y);
        if (d < particleGrabRadius) {
          draggedParticle = particle;
          draggedParticle.set(midpoint.x, midpoint.y,);
          //break;
        }
      }
    } else {
      draggedParticle = null;
    }

  }

}

function windowResized(){
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function keyPressed(){
  //press the space to reload
  if(keyCode === 32){
    location.reload();
  }
  
}