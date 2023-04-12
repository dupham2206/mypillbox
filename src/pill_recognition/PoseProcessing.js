function IOU(a, b) {
  let areaA = a[2] * a[3];
  let areaB = b[2] * b[3];
  const intersectionMinX = Math.max(a[0], b[0]);
  const intersectionMinY = Math.max(a[1], b[1]);
  const intersectionMaxX = Math.min(a[0] + a[2], b[0] + b[2]);
  const intersectionMaxY = Math.min(a[1] + a[3], b[1] + b[3]);
  const intersectionArea =
    Math.max(intersectionMaxY - intersectionMinY, 0) *
    Math.max(intersectionMaxX - intersectionMinX, 0);
  return intersectionArea / (areaA + areaB - intersectionArea);
}

export default function PoseProcessing(single_boxes, multi_boxes) {
  for(let i = 0; i < single_boxes.length; ++i){
    single_boxes[i].objectClass = 107
    for(let j = 0; j < multi_boxes.length; ++j){
      if(IOU(single_boxes[i].bounds, multi_boxes[j].bounds) >= 0.65){
        single_boxes[i].objectClass = multi_boxes[j].objectClass
      }
    }
  }
  return single_boxes
}