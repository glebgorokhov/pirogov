/* eslint-disable */
const $ = window.$;

import page from 'page';
import {logoAnimation} from "../../components/lottie/lottie";

export function router () {

  // Прелодер
  page('/', function () {
    console.log('Главная');
    window.logoAnimation.play();

    const block = $('.js-preloader');

    setTimeout(() => {
      block.addClass('is-visible');
    }, 2000);

    setTimeout(() => {
      block.addClass('is-loading');
    }, 3000);

    setTimeout(() => {
      window.logoAnimation.pause();
    }, 5000);

    setTimeout(() => {
      block.addClass('is-loaded');
    }, 8000);

    setTimeout(() => {
      window.mySlider.slideTo(0);
      page('/cases/');
      window.logoAnimation.play();
    }, 8500);

    setTimeout(() => {
      block.hide();
      $('.lottie').addClass('is-clickable');
    }, 9500);
  });

  /* page.exit('/', function (e) {
    console.log('Уходим с главной');
  }); */

  // Кейсы
  page('/cases/', function () {
    console.log('Кейсы');

    if ($(document).find('.js-slider').length) {
      $(document).find('.js-slider').addClass('is-visible');
    }

    $('.js-page-cases').addClass('is-visible');
    page404Close();
  });

  page.exit('/cases/', function (e, next) {
    console.log('Уход с кейсов');

    $(document).find('.js-slider').removeClass('is-visible');
    $('.js-page-cases').removeClass('is-visible');
    next();
  });

  // Кейс
  page('/cases/:case/', function (e) {
    if ($(document).find(`[data-case-name="${e.params.case}"]`).length > 0) {
      setTimeout(() => {
        $('.js-page-case').addClass('is-visible');
      }, 1000);

      page404Close();
    } else {
      page('/');
      page404Show();
    }
  });

  page.exit('/cases/:case/', function (e, next) {
    console.log(`Уход с кейса ${e.params.case}`);

    console.log(e);

    $('.js-page-case').removeClass('is-visible');
    $(document).find('.case').removeClass('is-active');
    $(document).find('.is-case-open').removeClass('is-case-open');
    window.mySlider.slideTo(window.currentCase);
    next();
  });

  // Контакты
  page('/contacts/', function (e) {
    console.log(`Контакты`);

    window.logoAnimation.setDirection(-1);
    window.logoAnimation.play();

    setTimeout(() => {
      window.logoAnimation.pause();
    }, 2000);

    $(document).find('.js-contacts').addClass('is-visible');
    $('.js-page-contacts').addClass('is-visible');
    page404Close();
  });

  page.exit('/contacts/', function (e, next) {
    console.log(`Контакты`);

    window.logoAnimation.setDirection(1);
    window.logoAnimation.play();

    $(document).find('.js-contacts').removeClass('is-visible');
    $('.js-page-contacts').removeClass('is-visible');
    next();
  });

  // 404
  page('*', function (e) {
    page404Show();
  });

  function page404Show () {
    console.log(`404`);

    $(document).find('.page-404').addClass('is-visible');
    $('.js-page-404').addClass('is-visible');
  }

  function page404Close () {
    // Уход с 404
    $(document).find('.page-404').removeClass('is-visible');
    $('.js-page-404').removeClass('is-visible');
  }

  // Инициализация
  page();

  // Работа ссылок
  $(document).on('click', '.js-link', function (e) {
    page($(this).data('link'));
    e.preventDefault()
  });

  $(document).on('click', '.js-back', function () {
    window.history.back();
  });

  $(document).on('click', '.contacts__link', function (e) {
    e.stopPropagation();
  });
}
/* eslint-enable */
