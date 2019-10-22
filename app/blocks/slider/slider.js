/* eslint-disable */
// https://idangero.us/swiper/api/
import * as Swiper from 'swiper/dist/js/swiper';

const $ = window.$;

export function slider() {
  $('.js-slider').each(function () {
    const
      block = $(this);

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
  });
}

/* eslint-enable */
