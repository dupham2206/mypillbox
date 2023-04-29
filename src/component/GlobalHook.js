import { useCallback, useState, useEffect } from 'react';
import * as React from 'react';
import { createGlobalState } from 'react-hooks-global-state';

export const SCREEN_STATES = {
  PILL_CAMERA: 0,
  PILL_LOADING: 1,
  PILL_RESULTS: 2,
  START: 3,
  HOMEPAGE: 4,
  OCR_START: 5,
  OCR_LOADING: 6,
  OCR_RESULT: 7,
  SCHEDULE: 8,
  TIP: 9,
  SEARCH_PILL: 10,
  SEARCH_PILL_DETAIL: 11,
};

let curDate = new Date()

export const { useGlobalState } = createGlobalState({
  screenState: SCREEN_STATES.START,
  image: null,
  tipUse: null,
  boundingBoxes: null,
  modelSingleState: null,
  modelMultipleState: null,
  progressOCR: 0,
  OCRData: [],
  pillChoose: null,
  dayChoose: curDate.getUTCDate(),
});

