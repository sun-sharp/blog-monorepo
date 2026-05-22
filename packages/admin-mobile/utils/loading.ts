const LOADING_SHOW_EVENT = 'global:loading:show';
const LOADING_HIDE_EVENT = 'global:loading:hide';

let requestCount = 0;
let loadingStartTime = 0;
const MIN_LOADING_TIME = 300;

function show(text = '加载中...') {
  if (requestCount === 0) {
    loadingStartTime = Date.now();
    uni.$emit(LOADING_SHOW_EVENT, { text });
  }
  requestCount++;
}

function hide(): Promise<void> {
  return new Promise((resolve) => {
    requestCount--;
    if (requestCount <= 0) {
      requestCount = 0;
      const elapsed = Date.now() - loadingStartTime;
      if (elapsed < MIN_LOADING_TIME) {
        setTimeout(() => {
          uni.$emit(LOADING_HIDE_EVENT);
          resolve();
        }, MIN_LOADING_TIME - elapsed);
      } else {
        uni.$emit(LOADING_HIDE_EVENT);
        resolve();
      }
    } else {
      resolve();
    }
  });
}

export const loading = {
  show,
  hide,
  SHOW_EVENT: LOADING_SHOW_EVENT,
  HIDE_EVENT: LOADING_HIDE_EVENT,
};
