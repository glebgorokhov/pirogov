// Скрипт "замораживает" страничку, запрещая скролл
const $ = window.$;

export function freeze() {
  const h = $('.case');

  h.css('overflow-y', 'hidden');

  h.css({
    height: '100%',
    'overflow-y': 'hidden',
  });
}

export function unfreeze() {
  const h = $('.case');

  h.css({
    height: '',
    'overflow-y': '',
  });

  setTimeout(() => {
    $('.main__page_case').scrollTop(0);
  }, 1);
}

export function freezebuttons() {
  $(document).on('click', '.js-freeze', (e) => {
    e.preventDefault();
    freeze();
  });

  $(document).on('click', '.js-unfreeze', (e) => {
    e.preventDefault();
    unfreeze();
  });
}
