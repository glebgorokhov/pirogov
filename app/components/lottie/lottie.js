/* eslint-disable */
const $ = window.$;

import lottie from 'lottie-web/build/player/lottie.min';

window.logoAnimation = lottie.loadAnimation({
  container: document.getElementById('lottieLogo'),
  renderer: 'svg',
  loop: false,
  autoplay: false,
  path: 'assets/json/logo.json'
});

window.logoToSecondState = function () {
  window.logoAnimation.goToAndStop(6200);
};

window.logoToFirstState = function () {
  window.logoAnimation.goToAndStop(5000);
};
/* eslint-enable */
