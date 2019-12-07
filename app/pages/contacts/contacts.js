/* eslint-disable */
const $ = window.$;

export function contactsLayout () {
  const
    container = $('.js-contacts');

  $.getJSON('/assets/json/contacts.json', function (json) {
    $.each(json, function (i) {
      const html = `
        <div class="contacts__item">
          <a class="contacts__link" href="${json[i].link}" target="_blank">${json[i].text}</a>
        </div>
      `;

      container.append(html);
    });
  });
}
/* eslint-enable */
