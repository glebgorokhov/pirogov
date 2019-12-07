/* eslint-disable */
// https://idangero.us/swiper/api/
import * as Swiper from 'swiper/dist/js/swiper';

const $ = window.$;

export function slider() {
  $('.js-slider').each(function () {
    const
      block = $(this),
      slidesContent = block.find('.swiper-wrapper'),
      url = '/assets/json/cases.json';

    slidesContent.html('');

    $.getJSON(url, function (json) {
      let objects = json;

      window.casesCount = objects.length;

      $.each(objects, function (i) {
        // Генерируем многострочный заголовок
        function createTitle () {
          let title = '';

          $.each(objects[i].title, function (n) {
            title += `<span>${objects[i].title[n]}</span>`;
          });

          return title;
        }

        // Генерируем разметку слайда
        let html = `
          <div class="slider__slide swiper-slide" data-case-name="${objects[i].linkName}">
              <div class="container">
                  <h2 class="slider__title js-link" data-link="/cases/${objects[i].linkName}/" data-case-id="${objects[i].linkName}">
                    ${createTitle()}
                  </h2>
                  <div class="slider__video">
                      <div class="slider__video-wrapper">
                        <video class="js-slide-video" src="${objects[i].video}" muted="muted" playsinline="playsinline" preload="auto"></video>
                      </div>
                  </div>
              </div>
          </div>
        `;

        slidesContent.append(html);
      });

      let isMobile = false;
      let isChangedToDesktop = true;
      let mobileSlideHtml = `
          <div class="slider__slide swiper-slide js-mobile-slide">
              <div class="container">
                  <h2 class="slider__title js-link">
                    Подробное<br> описание<br> каждого<br> кейса<br> смотри<br> с десктопа
                  </h2>
              </div>
          </div>
        `;

      if ($(window).width() < globalOptions.sizes.sm) {
        slidesContent.append(mobileSlideHtml);
        isMobile = true;
        isChangedToDesktop = false;
      }

      window.mySlider = new Swiper(block, {
        loop: false,
        speed: 1000,
        autoplay: {
          delay: 10500,
          disableOnInteraction: false,
          waitForTransition: false,
        },
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: false,
        roundLengths: true,
        freeMode: false,
        keyboard: {
          enabled: true,
        },
        mousewheel: {
          releaseOnEdges: true,
        },
        pagination: {
          el: block.find('.circle-dots'),
          clickable: true,
          bulletActiveClass: 'is-active',
          bulletClass: 'circle-dots__circle',
          renderBullet: function (index, className) {
            return `
            <div class="${className}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <circle class="js-circle-dot-percent" cx="16" cy="16" r="15" style="transition: stroke-dashoffset ${this.params.autoplay.delay}ms linear;"></circle>
                </svg>
                <div class="circle-dots__clickable"></div>
            </div>
          `;
          },
        },
        on: {
          init: function () {
            this.slideTo(1);
          },
          slideChangeTransitionStart: function () {
            $(document).find('.swiper-slide-active video')[0].currentTime = 0;

            setTimeout(() => {
              $(document).find('.swiper-slide-active video')[0].play();
            }, 500);
          },
        },
      });

      $(window).resize(function () {
        if ($(window).width() >= globalOptions.sizes.sm && !isChangedToDesktop) {
          isChangedToDesktop = true;
          $(document).find('.js-mobile-slide').remove();
        } else if ($(window).width() < globalOptions.sizes.sm && isChangedToDesktop) {
          slidesContent.append(mobileSlideHtml);
          isChangedToDesktop = false;
        }

        mySlider.update();
      });
    });
  });
}

/* eslint-enable */
