/* eslint-disable */
const $ = window.$;

import {logoAnimation} from "../lottie/lottie";

const block = $('.js-preloader');

export function preloader () {
  /*
  logoAnimation();

  setTimeout(() => {
    block.addClass('is-visible');
  }, 2000);

  setTimeout(() => {
    block.addClass('is-loading');
  }, 3000);

  setTimeout(() => {
    block.addClass('is-loaded');
  }, 8000);

  setTimeout(() => {
    window.mySlider.slideTo(0);
  }, 8500);

  setTimeout(() => {
    block.hide();

    // Главная
    if ($(document).find('.js-slider').length) {
      window.mySlider.slideTo(0);
      $(document).find('.js-slider').addClass('is-visible');
    }

    // 404, Контакты
    $(document).find('.page-404, .js-contacts').addClass('is-visible');
  }, 9500); */

  block.hide();

  if ($(document).find('.js-slider').length) {
    window.mySlider.slideTo(0);
    $(document).find('.js-slider').addClass('is-visible');
  }

  $(document).find('.page-404, .js-contacts').addClass('is-visible');
}
/* eslint-enable */
