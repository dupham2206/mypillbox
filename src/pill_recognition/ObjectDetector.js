import {
  media,
  MobileModel,
  torch,
  torchvision,
} from 'react-native-pytorch-core';

const T = torchvision.transforms;
const IMAGE_SIZE = 960;

/**
 * Computes intersection-over-union overlap between two bounding boxes.
 */
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

function nonMaxSuppression(boxes, limit, threshold) {
  // Do an argsort on the confidence scores, from high to low.
  const newBoxes = boxes.sort((a, b) => {
    return a.score - b.score;
  });

  const selected = [];
  const active = new Array(newBoxes.length).fill(true);
  let numActive = active.length;

  // The algorithm is simple: Start with the box that has the highest score.
  // Remove any remaining boxes that overlap it more than the given threshold
  // amount. If there are any boxes left (i.e. these did not overlap with any
  // previous boxes), then repeat this procedure, until no more boxes remain
  // or the limit has been reached.
  let done = false;
  for (let i = 0; i < newBoxes.length && !done; i++) {
    if (active[i]) {
      const boxA = newBoxes[i];
      selected.push(boxA);
      if (selected.length >= limit) break;

      for (let j = i + 1; j < newBoxes.length; j++) {
        if (active[j]) {
          const boxB = newBoxes[j];
          if (IOU(boxA.bounds, boxB.bounds) > threshold) {
            active[j] = false;
            numActive -= 1;
            if (numActive <= 0) {
              done = true;
              break;
            }
          }
        }
      }
    }
  }
  return selected;
}
function outputsToNMSPredictions(
  prediction,
  imgScaleX,
  imgScaleY,
  startX,
  startY,
) {
  const predictionThreshold = 0.3;
  const iOUThreshold = 0.65;
  const NMSLimit = 15;
  const results = [];
  let dataPrediction = prediction.data()
  const numberOfClass = prediction.shape[1] - 5
  const lenRow = prediction.shape[1]
  let len = dataPrediction.length
  let newIndex = []
  let st = 4;
  let index = 0;
  while(st < len){
    if(dataPrediction[st] > predictionThreshold){
      // newIndex.push(index)
      let max_score = -1;
      let max_class = 0;
      for (let j = 0; j < numberOfClass; j++) {
        if (dataPrediction[st + 1 + j] > max_score) {
          max_score = dataPrediction[st + 1 + j];
          max_class = j;
        }
      }
      const x = dataPrediction[st - 4];
      const y = dataPrediction[st - 3];
      const w = dataPrediction[st - 2];
      const h = dataPrediction[st - 1];
      const left = imgScaleX * (x - w / 2);
      const top = imgScaleY * (y - h / 2);
      const bound = [startX + left, startY + top, w * imgScaleX, h * imgScaleY];

      const result = {
        classIndex: max_class,
        score: max_score,
        bounds: bound,
      };
      results.push(result);
    }
    st = st + lenRow
  }
  let res = nonMaxSuppression(results, NMSLimit, iOUThreshold);
  return res

}

export default async function detectObjects(image, model) {
  console.log("Start", Date.now())
  // Get image width and height
  const imageWidth = image.getWidth();
  const imageHeight = image.getHeight();

  // Convert image to blob, which is a byte representation of the image
  // in the format height (H), width (W), and channels (C), or HWC for short
  const blob = media.toBlob(image);

  // Get a tensor from image the blob and also define in what format
  // the image blob is.
  let tensor = torch.fromBlob(blob, [imageHeight, imageWidth, 3]);

  // Rearrange the tensor shape to be [CHW]
  tensor = tensor.permute([2, 0, 1]);

  // Divide the tensor values by 255 to get values between [0, 1]
  tensor = tensor.div(255);

  const minSize = Math.min(imageHeight, imageWidth);
  const delta = (imageHeight - imageWidth) / 2
  // Resize the image tensor to 3 x min(height, IMAGE_SIZE) x min(width, IMAGE_SIZE)
  needHeight = (imageHeight * IMAGE_SIZE) / minSize;
  const resize = T.resize([needHeight, IMAGE_SIZE]);
  // const resize = T.resize([IMAGE_SIZE, IMAGE_SIZE]);

  tensor = resize(tensor);

  // Center crop the image to IMAGE_SIZE x IMAGE_SIZE
  const centerCrop = T.centerCrop([IMAGE_SIZE]);
  tensor = centerCrop(tensor);

  // Unsqueeze adds 1 leading dimension to the tensor
  const formattedInputTensor = tensor.unsqueeze(0);
  // Run inference
  const output = await model.forward(formattedInputTensor);

  const prediction = output[0];
  const imgScaleX = minSize / IMAGE_SIZE;
  const imgScaleY = minSize / IMAGE_SIZE;

  // Filter results and calulate bounds
  const results = outputsToNMSPredictions(
    prediction[0],
    imgScaleX,
    imgScaleY,
    0,
    0,
  );



  // Format filtered results with object name and bounds
  const resultBoxes = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const nameIdx = result.classIndex;
    result.bounds[1] += delta
    const match = {
      objectClass: nameIdx,
      bounds: result.bounds,
      score: result.score,
    };

    resultBoxes.push(match);
  }

  console.log("After end", Date.now())
  return resultBoxes;
}

