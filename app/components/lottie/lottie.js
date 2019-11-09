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
/* eslint-enable */
