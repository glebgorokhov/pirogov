/* eslint-disable */
// https://idangero.us/swiper/api/
import * as Swiper from 'swiper/dist/js/swiper';

const $ = window.$;

export function slider() {
  window.mySlider = '';

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
                  <div class="slider__video js-link" data-link="/cases/${objects[i].linkName}/">
                      <div class="slider__video-wrapper">
                        <video class="js-slide-video" src="${objects[i].video}" muted="muted" playsinline="playsinline" preload="auto"></video>
                      </div>
                  </div>
              </div>
          </div>
        `;

        slidesContent.append(html);
      });

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
        effect: 'fade',
        freeMode: false,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
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

            document.onkeydown = checkKey;

            const sw = this;

            function checkKey(e) {
              e = e || window.event;

              if (e.keyCode == '38') {
                sw.slidePrev();
              } else if (e.keyCode == '40') {
                sw.slideNext();
              }
            }
          },
          slideChangeTransitionStart: function () {
            $(document).find('.swiper-slide-active video')[0].currentTime = 0;

            setTimeout(() => {
              $(document).find('.swiper-slide-active video')[0].play();
            }, 500);
          },
        },
      });
    });
  });
}

/* eslint-enable */
