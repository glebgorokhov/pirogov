/* eslint-disable */
const $ = window.$;

import page from 'page';
import {loadCase} from "../../components/case/case";

let
  isMainPage = window.location.pathname === '/',
  isPageChanged = false;

if (!window.currentCase) window.currentCase = 0;

const
  logoContainer = $('.lottie'),
  preloader = $('.js-preloader');

// Показать/скрыть страницу 404
function page404Toggle (hide) {
  hide ? $(document).find('.page-404').removeClass('is-visible') : $(document).find('.page-404').addClass('is-visible');
  hide ? $('.js-page-404').removeClass('is-visible') : $('.js-page-404').addClass('is-visible');
}

// Смена активного контейнера (при переключении страниц)
function changeContainer (selector, delayOne, delayTwo) {
  console.log(isMainPage, isPageChanged);

  setTimeout(() => {
    $(document).find(selector).addClass('is-visible');
  }, delayOne || 0);

  setTimeout(() => {
    $(document).find(selector).siblings().removeClass('is-visible');
  }, delayTwo || 0);

  page404Toggle(true);

  // Состояние слайдера
  if (selector === '.js-page-cases') {
    $('.js-slider').addClass('is-visible');
    if (window.mySlider.params) {
      window.mySlider.slideTo(window.currentCase);
      window.mySlider.keyboard.enable();
    }
    $(document).find('.case').removeClass('is-active');
  } else {
    $('.js-slider').removeClass('is-visible');
    if (window.mySlider.params) {
      window.mySlider.keyboard.disable();
    }
  }

  // Переход в контакты
  if (selector === '.js-page-contacts') {
    $('.js-contacts').addClass('is-visible');

    setTimeout(() => {
      $(document).find('.case.is-active').removeClass('is-active');
    }, 1000);

    if (!isMainPage && !isPageChanged) window.logoToFirstState();
  } else {
    $('.js-contacts').removeClass('is-visible');
    if (!isMainPage && !isPageChanged) window.logoToSecondState();
  }

  // Переход в кейс
  if (selector === '.js-page-case') {
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
  console.log('Страница главная: ' + isMainPage);

  if (!isMainPage) {
    preloader.hide();
    logoContainer.addClass('is-clickable');
  }

  // Прелодер
  page('/', function () {
    console.log('Главная');
    window.logoAnimation.play();
    isPageChanged = true;

    setTimeout(() => {
      preloader.addClass('is-visible');
    }, 2000);

    setTimeout(() => {
      preloader.addClass('is-loading');
    }, 3000);

    // setTimeout(() => {
    //   window.logoAnimation.pause();
    // }, 5000);

    setTimeout(() => {
      preloader.addClass('is-loaded');
    }, 8000);

    setTimeout(() => {
      window.mySlider.slideTo(0);
      window.logoAnimation.play();
    }, 8500);

    setTimeout(() => {
      preloader.hide();
      logoContainer.addClass('is-clickable');
      page('/cases/');
    }, 9700);
  });

  // Кейсы
  page('/cases/', function () {
    console.log('Кейсы');
    $(document).find('.case').removeClass('is-active');
    $(document).find('.is-case-open').removeClass('is-case-open');
    changeContainer('.js-page-cases');
  });

  // Кейс

  function logicCase () {
    page('/cases/:case/', function (e) {
      if (window.casesNames[e.params.case]) {
        loadCase(window.casesNamesSimple.indexOf(e.params.case));
        changeContainer('.js-page-case', 1000, 1000);
      } else {
        console.log(`Кейс ${e.params.case} не существует!`);
        page404Toggle();
      }
    });

    page.exit('/cases/:case/', function (e, next) {
      console.log(`Уход с кейса ${e.params.case}`);
      next();
    });
  }
  logicCase();

  // Контакты
  function logicContacts () {
    page('/contacts/', function (e) {
      contactsLogo();
      changeContainer('.js-page-contacts');
      $('.case').addClass('is-preloaded');
    });

    page.exit('/contacts/', function (e, next) {
      contactsLogo(true);
      setTimeout(() => {
        $('.case').removeClass('is-preloaded');
      }, 3000);
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
