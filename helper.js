

// AttractionBehavior 用法参考：http://haptic-data.com/toxiclibsjs/examples/attraction2d
//让手指与软体互相排斥：
//从 toxi.physics2d.behaviors 中获取 AttractionBehavior。
const { AttractionBehavior } = toxi.physics2d.behaviors;


//为每个手指创建一个排斥行为（负的吸引力）

// 根据你的需求调整排斥力的大小和范围
const repulsionStrength = -0.5;
const repulsionRadius = 50;

// 使用检测到的手指坐标创建一个 Vec2D 对象
let fingerPosition = new Vec2D(fingerX, fingerY);

// 创建一个排斥行为
let repulsion = new AttractionBehavior(fingerPosition, repulsionRadius, repulsionStrength);


//将排斥行为添加到物理系统中。
physics.addBehavior(repulsion);

//在每一帧更新手指的位置。
// 在 draw 函数中，使用检测到的新手指坐标更新 Vec2D 对象
fingerPosition.set(fingerX, fingerY);


  //_______________________________________________________________________________

  // 获取手部landmark坐标
  const indexArray = [0, 5, 9, 13, 17]; // 选择你需要的landmark索引
  const handLandmarks = getLandmarkCoordinates(indexArray, detections);

  // 遍历手部landmark坐标
  // for (let index in handLandmarks) {
  //   const landmarkPosition = handLandmarks[index];

  //   if (!handRepulsions[index] || !handParticles[index]) {
  //     const handPositionToxi = new toxi.geom.Vec2D(landmarkPosition.x, landmarkPosition.y);
  //     handParticles[index] = new toxi.physics2d.VerletParticle2D(handPositionToxi);

  //     const repulsionRadius = 50;
  //     const repulsionStrength = -1.5;
  //     handRepulsions[index] = new toxi.physics2d.behaviors.AttractionBehavior(handParticles[index], repulsionRadius, repulsionStrength);
  //     physics.addBehavior(handRepulsions[index]);
  //   }

  //   const handPositionToxi = new toxi.geom.Vec2D(landmarkPosition.x, landmarkPosition.y);
  //   handParticles[index].set(handPositionToxi);
  // }
  //_______________________________________________________________________________



  
          //_______________________________________________________________________

          // if (draggedParticle) {
          //   physics.removeBehavior(handRepulsions[4]); // 移除原本与食指的排斥力
          //   physics.removeBehavior(handRepulsions[8]); // 移除原本与拇指的排斥力
          // }

          // draggedParticle = particle;
          // draggedParticle.set(midpoint.x, midpoint.y);

          // // 添加吸引力
          // const attractionRadius = 30;
          // const attractionStrength = -0.9;
          // handRepulsions[4] = new toxi.physics2d.behaviors.AttractionBehavior(handParticles[4], attractionRadius, attractionStrength);
          // physics.addBehavior(handRepulsions[4]);
          // handRepulsions[8] = new toxi.physics2d.behaviors.AttractionBehavior(handParticles[8], attractionRadius, attractionStrength);
          // physics.addBehavior(handRepulsions[8]);
        
          //________________________________________________________________________

 //  AttractionBehavior构造函数接受四个参数：

// 粒子：作为引力中心的粒子。
// 半径：引力影响范围的半径。
// 强度：引力（或排斥力）的强度。正值表示引力，负值表示排斥力。
// 衰减（可选）：距离衰减率，默认值为0。

// 在这个例子中，每个粒子都有一个半径为20像素的排斥力场，强度为-1.2。这意味着当其他粒子进入该范围时，它们将受到排斥力的影响。
// 请注意，这种排斥力仅在粒子间起作用，因此粒子不会互相靠得太近。

  // // 将手部粒子的排斥力应用于花朵粒子
  // const repulsionThreshold = 100; // 您可以调整此值以获得更好的效果
  // const repulsionStrength = 5; // 您可以调整此值以获得更好的效果
  // for (const handParticle of handParticles) {
  //   for (const flowerParticle of particles) {
  //     const handPos = handParticle.getParticle();
  //     const distance = handPos.distanceTo(flowerParticle);
  //     if (distance < repulsionThreshold) {
  //       const direction = flowerParticle.sub(handPos).normalize().scale(repulsionStrength);
  //       flowerParticle.addSelf(direction);
  //     }
  //   }
  // }