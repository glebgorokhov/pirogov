/* eslint-disable */
const $ = window.$;

import page from 'page';

let
  isMainPage = window.location.pathname === '/',
  isPageChanged = false;

const logoContainer = $('.lottie');

// Показать/скрыть страницу 404
function page404Toggle (hide) {
  hide ? $(document).find('.page-404').removeClass('is-visible') : $(document).find('.page-404').addClass('is-visible');
  hide ? $('.js-page-404').removeClass('is-visible') : $('.js-page-404').addClass('is-visible');
}

// Смена активного контейнера (при переключении страниц)
function changeContainer (selector) {
  $(document).find(selector).addClass('is-visible').siblings().removeClass('is-visible');

  page404Toggle(true);

  // Состояние слайдера
  if (selector === '.js-page-cases') {
    $('.js-slider').addClass('is-visible');
  } else {
    $('.js-slider').removeClass('is-visible');
  }

  // Переход в контакты
  if (selector === '.js-page-contacts') {
    $('.js-contacts').addClass('is-visible');
    if (!isMainPage && !isPageChanged) window.logoToSecondState();
  } else {
    $('.js-contacts').removeClass('is-visible');
    if (!isMainPage && !isPageChanged) window.logoToFirstState();
  }

  isPageChanged = true;
}

// Анимация лого в контактах
function contactsLogo (backwards) {
  if (!backwards) {
    window.logoAnimation.setDirection(-1);
    window.logoAnimation.play();
    logoContainer.removeClass('is-clickable');
  } else {
    window.logoAnimation.setDirection(1);
    window.logoAnimation.play();
    logoContainer.addClass('is-clickable');
  }

  setTimeout(() => {
    window.logoAnimation.pause();
  }, 1200);
}

export function router () {
  if (!isMainPage) {
    window.logoToSecondState();
  }

  // Прелодер
  page('/', function () {
    console.log('Главная');
    window.logoAnimation.play();
    isPageChanged = true;

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
      window.logoAnimation.play();
    }, 8500);

    setTimeout(() => {
      block.hide();
      $('.lottie').addClass('is-clickable');
      page('/cases/');
    }, 9700);
  });

  // Кейсы
  page('/cases/', function () {
    console.log('Кейсы');
    changeContainer('.js-page-cases');
  });

  // Кейс
  function logicCase () {
    page('/cases/:case/', function (e) {
      if ($(document).find(`[data-case-name="${e.params.case}"]`).length > 0) {
        setTimeout(() => {
          changeContainer('.js-page-case');
        }, 1000);
      } else {
        console.log('Кейс не существует! Редирект на главную');
        page('/cases/');
        page404Toggle();
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
  }
  logicCase();

  // Контакты
  function logicContacts () {
    page('/contacts/', function (e) {
      contactsLogo();
      changeContainer('.js-page-contacts');
    });

    page.exit('/contacts/', function (e, next) {
      contactsLogo(true);
      next();
    });
  }
  logicContacts();

  // 404
  page('*', function (e) {
    page404Toggle();
  });

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
