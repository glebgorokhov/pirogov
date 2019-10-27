/* eslint-disable */
const $ = window.$;

export function cases () {
  $(window).scroll(function () {
    const
      w = $(this),
      sT = w.scrollTop(),
      line = $(document).find('.case__line');

    sT > 100 ? line.addClass('is-hidden') : line.removeClass('is-hidden');
  });
}
/* eslint-enable */
