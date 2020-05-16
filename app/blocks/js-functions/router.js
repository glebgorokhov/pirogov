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
function page404Toggle(hide) {
  hide ? $(document).find('.page-404').removeClass('is-visible') : $(document).find('.page-404').addClass('is-visible');
  hide ? $('.js-page-404').removeClass('is-visible') : $('.js-page-404').addClass('is-visible');
}

// Смена активного контейнера (при переключении страниц)
function changeContainer(selector, delayOne, delayTwo) {
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
  } else {
    $('.js-contacts').removeClass('is-visible');
  }

  // Переход в кейс
  if (selector === '.js-page-case') {
  }

  isPageChanged = true;
}

// Анимация лого в контактах
function contactsLogo(backwards) {
  if (!backwards) {
    logoContainer.removeClass('is-clickable');
  } else {
    logoContainer.addClass('is-clickable');
  }
}

export function router() {
  console.log('Страница главная: ' + isMainPage);

  if (!isMainPage) {
    preloader.hide();
    logoContainer.addClass('is-clickable');
  }

  const areVideosLoaded = new Promise(function (resolve, reject) {
    let loadedVideosAmount = 0;

    const interval = setInterval(function () {
      const
        videos = $(document).find('.js-slide-video'),
        videoLength = videos.length;

      videos.each(function () {
        const el = $(this);

        el.on('canplaythrough', function () {
          if (!el.hasClass('is-playing')) {
            el.addClass('is-playing');
            loadedVideosAmount += 1;
            console.log('Slider: Video loaded');
          }
        });

        // if (el[0].readyState > 3) {
        //   if (!el.hasClass('is-playing')) el.addClass('is-playing');
        //   loadedVideosAmount += 1;
        //   console.log('Slider: Video from cache');
        // }
      });

      //if (videoLength === loadedVideosAmount && videoLength > 0) {
      if (videoLength > 1 && videoLength > 0) {
        resolve();
        clearInterval(interval);
      }
    }, 100);
  });

  // Прелодер
  page('/', function () {
    console.log('Главная');
    isPageChanged = true;

    let timeStart = new Date();

    setTimeout(() => {
      preloader.addClass('is-visible');
    }, 2000);

    setTimeout(() => {
      preloader.addClass('is-loading');
    }, 3000);

    // setTimeout(() => {
    //   window.logoAnimation.pause();
    // }, 5000);

    areVideosLoaded.then(function () {
      let timeEnd = new Date();
      let timeDiff = timeEnd - timeStart;

      console.log(`Время загрузки: ${timeDiff}ms`);

      setTimeout(() => {
        // $(document).find('.preloader__title_copy').addClass('is-preloaded');
        $(document).find('.preloader__wrapper')
          .width($(document).find('.preloader__wrapper').width());

        setTimeout(() => {
          $(document).find('.preloader__wrapper').css({ transitionDuration: '2s' }).width('100%')
        }, 1);

      }, timeDiff < 8000 ? 8000 - timeDiff - 2000 : 0);

      setTimeout(() => {
        preloader.addClass('is-loaded');
      }, timeDiff < 8000 ? 8000 - timeDiff : 2000);

      setTimeout(() => {
        window.mySlider.slideTo(0);
      }, timeDiff < 8000 ? 8000 - timeDiff + 500 : 2500);

      setTimeout(() => {
        preloader.hide();
        logoContainer.addClass('is-clickable');
        logoContainer.removeClass('is-hidden');
        page('/cases/');
      }, timeDiff < 8000 ? 9700 - timeDiff : 3700);
    });
  });

  // Кейсы
  page('/cases/', function () {
    console.log('Кейсы');
    $(document).find('.case').removeClass('is-active');
    $(document).find('.is-case-open').removeClass('is-case-open');
    changeContainer('.js-page-cases');
    logoContainer.removeClass('is-hidden');
  });

  // Кейс

  function logicCase() {
    page('/cases/:case/', function (e) {
      logoContainer.removeClass('is-hidden');
      logoContainer.addClass('is-case');

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
      logoContainer.removeClass('is-case');
      next();
    });
  }

  logicCase();

  // Контакты
  function logicContacts() {
    page('/contacts/', function (e) {
      contactsLogo();
      changeContainer('.js-page-contacts');
      $('.case').addClass('is-preloaded');
      logoContainer.addClass('is-hidden');
      setTimeout(() => {
        $(document).find('.contacts__video')[0].play();
      }, 500);
    });

    page.exit('/contacts/', function (e, next) {
      contactsLogo(true);
      logoContainer.removeClass('is-hidden');

      setTimeout(() => {
        const video = $(document).find('.contacts__video')[0];

        video.pause();
        video.currentTime = 0;
        video.load();
      }, 1000);

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
