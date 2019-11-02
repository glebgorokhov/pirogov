/* eslint-disable */
const $ = window.$;

import page from 'page';
import {logoAnimation} from "../../components/lottie/lottie";

export function router () {
  // Прелодер
  page('/', function () {
    console.log('Главная');

    logoAnimation();

    const block = $('.js-preloader');

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
      page('/cases/');
    }, 8500);

    setTimeout(() => {
      block.hide();
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

    window.mySlider.allowSlideNext = true;
    $('.js-page-cases').addClass('is-visible');
    page404Close();
  });

  page.exit('/cases/', function (e, next) {
    console.log('Уход с кейсов');

    $(document).find('.js-slider').removeClass('is-visible');
    window.mySlider.allowSlideNext = false;
    $('.js-page-cases').removeClass('is-visible');
    next();
  });

  // Кейс
  page('/cases/:case/', function (e) {
    console.log(`Кейс ${e.params.case}`);

    $('.js-page-case').addClass('is-visible');
    page404Close();
  });

  page.exit('/cases/:case/', function (e, next) {
    console.log(`Уход с кейса ${e.params.case}`);

    $('.js-page-case').removeClass('is-visible');
    next();
  });

  // Контакты
  page('/contacts/', function (e) {
    console.log(`Контакты`);

    $(document).find('.js-contacts').addClass('is-visible');
    $('.js-page-contacts').addClass('is-visible');
    page404Close();
  });

  page.exit('/contacts/', function (e, next) {
    console.log(`Контакты`);

    $(document).find('.js-contacts').removeClass('is-visible');
    $('.js-page-contacts').removeClass('is-visible');
    next();
  });

  // 404
  page('*', function (e) {
    console.log(`404`);

    $(document).find('.page-404').addClass('is-visible');
    $('.js-page-404').addClass('is-visible');
  });

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
