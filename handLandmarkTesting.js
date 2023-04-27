function getLandmarkCoordinates(indexArray, detections) {
  const coordinates = {};
  if (detections != undefined && detections.multiHandLandmarks != undefined) {
    for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
      for (let j = 0; j < indexArray.length; j++) {
        let index = indexArray[j];
        let x = detections.multiHandLandmarks[i][index].x * width;
        let y = detections.multiHandLandmarks[i][index].y * height;
        coordinates[index] = { x, y };
      }
    }
  }
  return coordinates;
}

function calculateDistance(pointA, pointB) {
  const deltaX = pointA.x - pointB.x;
  const deltaY = pointA.y - pointB.y;
  //求平方根 三角函数
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function addHandParticle(landmarkCoordinates) {
  for (const index in landmarkCoordinates) {
    if (index == 8 || index == 4) {
      continue; // 跳过索引为 8 或 4 的关键点
    }
    const coord = landmarkCoordinates[index];
    const p = new HandParticle(coord.x, coord.y);
    handParticles.push(p);
    //physics.addParticle(p);
    //console.log("handParticle added in")

    // attraction 为负，粒子之间互相排斥
    //physics.addBehavior(new toxi.physics2d.behaviors.AttractionBehavior(p, 100, -5, 0));
  }
}

// function addHandParticle(landmarkCoordinates) {
//   for (const index in landmarkCoordinates) {
//     const coord = landmarkCoordinates[index];
//     const handParticle = new HandParticle(coord.x, coord.y);
//     handParticles.push(handParticle);

//     if (handAttractions[index]) {
//       physics.removeBehavior(handAttractions[index]); // 移除旧的 AttractionBehavior
//     }

//     const attraction = new toxi.physics2d.behaviors.AttractionBehavior(handParticle, 10, -0.2, 0);
//     handAttractions[index] = attraction;
//     physics.addBehavior(attraction); // 添加新的 AttractionBehavior
//   }
// }

function drawTestC(index, hue, size) { //画会变色的圆圈
  stroke(0, 0, 255);
  strokeWeight(1);
  //noStroke();
  //fill(hue);
  //noFill();

  //获得手部landmarks关键点

  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections.multiHandLandmarks[i][index[j]].x * width;
      let y = detections.multiHandLandmarks[i][index[j]].y * height;
      let z = detections.multiHandLandmarks[i][index[j]].z;

      let _x = detections.multiHandLandmarks[i][index[j + 1]].x * width;
      let _y = detections.multiHandLandmarks[i][index[j + 1]].y * height;
      let _z = detections.multiHandLandmarks[i][index[j + 1]].z;
      // line(x, y, _x, _y);

      // stroke(hue,200,250);
      // strokeWeight(1);
      fill(hue, 140, 220, 200);
      //rect(_x, _y,10,10);
      ellipse(x, y, size); //在这里！！

      //ellipse(_x, _y,100);

    }
  }

}

function drawHands() {
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < detections.multiHandLandmarks[i].length; j++) {
      let x = detections.multiHandLandmarks[i][j].x * width;
      let y = detections.multiHandLandmarks[i][j].y * height;
      let z = detections.multiHandLandmarks[i][j].z;
      // strokeWeight(0);
      // textFont('Helvetica Neue');
      // text(j, x, y);
      stroke(255);
      strokeWeight(10);

      point(x, y);

    }
    endShape();
  }
}

function drawLandmarks(indexArray, hue) {
  noFill();
  //fill(50);
  strokeWeight(8);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = indexArray[0]; j < indexArray[1]; j++) {
      let x = detections.multiHandLandmarks[i][j].x * width;
      let y = detections.multiHandLandmarks[i][j].y * height;
      // let z = detections.multiHandLandmarks[i][j].z;
      stroke(hue, 40, 255);
      point(x, y);
      //vertex(x, y);
      //vertex(y, x);

    }
    endShape();
  }
}

function drawLines(index) {
  stroke(0, 0, 255, 120);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections.multiHandLandmarks[i][index[j]].x * width;
      let y = detections.multiHandLandmarks[i][index[j]].y * height;
      // let z = detections.multiHandLandmarks[i][index[j]].z;

      let _x = detections.multiHandLandmarks[i][index[j + 1]].x * width;
      let _y = detections.multiHandLandmarks[i][index[j + 1]].y * height;
      // let _z = detections.multiHandLandmarks[i][index[j+1]].z;
      line(x, y, _x, _y);
      // vertex(x, y);
      // vertex(_x, _y);

    }
    endShape();
  }
}

function drawTest(indexArray, hue) {
  //noFill();
  fill(hue);
  strokeWeight(8);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = indexArray[0]; j < indexArray[1]; j++) {
      let x = detections.multiHandLandmarks[i][j].x * width;
      let y = detections.multiHandLandmarks[i][j].y * height;
      // let z = detections.multiHandLandmarks[i][j].z;
      stroke(hue, 40, 255);
      point(x, y);
      //vertex(x, y);
      //vertex(y, x);

    }
    endShape();
  }
}

function drawTestB(index, hue) {
  stroke(0, 0, 255);
  strokeWeight(10);
  noStroke();
  fill(hue);
  beginShape();
  for (let i = 0; i < detections.multiHandLandmarks.length; i++) {
    for (let j = 0; j < index.length - 1; j++) {
      let x = detections.multiHandLandmarks[i][index[j]].x * width;
      let y = detections.multiHandLandmarks[i][index[j]].y * height;
      // let z = detections.multiHandLandmarks[i][index[j]].z;

      let _x = detections.multiHandLandmarks[i][index[j + 1]].x * width;
      let _y = detections.multiHandLandmarks[i][index[j + 1]].y * height;
      // let _z = detections.multiHandLandmarks[i][index[j+1]].z;
      // line(x, y, _x, _y);

      vertex(x, y);
      vertex(_x, _y);

    }
    endShape();
  }

}

function drawHandsTest() {
  let hand_0 = detections.multiHandLandmarks[0];
  let hand_1 = detections.multiHandLandmarks[1];

  // let maxDist = dist(width - hand_0[8].x * width, hand_0[8].y * height,
  //   width - hand_0[7].x * width, hand_0[7].y * height);

  // let targetDistA = dist(width - hand_0[8].x * width, hand_0[8].y * height,
  //     width - hand_1[4].x * width, hand_1[4].y * height);

  // let targetDistB = dist(width - hand_0[4].x * width, hand_0[4].y * height,
  //       width - hand_1[8].x * width, hand_1[8].y * height);

  let a = hand_0[8].x * width;
  let b = hand_0[8].y * height;
  let c = hand_0[4].x * width;
  let d = hand_0[4].y * height;
  fill(100, 50, 200);
  ellipse(a, b, 100);
  ellipse(c, d, 100);

  // if (targetDistA < maxDist && targetDistB < maxDist) {
  //   drawTestC([4,8,12,16,20,0],90);
  // }

}


