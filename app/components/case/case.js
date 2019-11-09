/* eslint-disable */
const $ = window.$;

// Мелкие части секций
function createTitle (data) {
  let title = '';

  $.each(data.title, function (n) {
    title += `<span>${data.title[n]}</span>`;
  });

  return title;
}

function createTags (data) {
  let tags = '';

  $.each(data.tags, function (n) {
    tags += `<li class="case__tag">${data.tags[n]}</li>`;
  });

  return tags;
}

// Секции
function generateMainScreen (data) {
  const html = `
    <div class="case__main">
        <div class="container">
            <h1 class="case__title">${createTitle(data)}</h1>
            <div class="case__description">${data.text}</div>
            <ul class="case__tags">${createTags(data)}</ul>
            <p class="case__year">${data.year}</p>
        </div>
        
        <div class="case__main-video">
            <div class="case__main-video-wrapper">
              <video class="js-case-main-video" src="${data.video}" muted="muted" playsinline="playsinline" preload="auto" autoplay="autoplay"></video>
            </div>
        </div>
    </div>
  `;

  return html;
}

function generateVideoScreen (data) {
  const html = `
     <div class="case__video">
       <video src="${data.video}" autoplay="autoplay" loop="loop" muted="muted" playsinline="playsinline" preload="auto"></video>
     </div>
  `;

  return html;
}

function generateTextScreen (data) {
  const html = `
     <div class="case__texts">
         <h2 class="case__case-title">${data.title}</h2>
         <p class="case__case-text">${data.text}</p>
     </div>
  `;

  return html;
}

function generatePicturesScreen (data) {
  const html = `
    <div class="case__picture">
      <img src="${data.image}">
    </div>
  `;

  return html;
}

function generateScreenBg (data) {
  const html = `
    <div class="case__background-image">
      <img src="${data.backgroundImage}">
    </div>
  `;

  return html;
}

function generateSectionAttributes (data) {
  let attributes = '';

  if (data.backgroundColor) {
    attributes += `style="background-color: ${data.backgroundColor};"`;
  }

  attributes += ` class="case__screen ${data.class || ''}"`;

  return attributes;
}

function generateSection (type, data, object) {
  let html = ``;

  if (type === "mainScreen") {
    html += generateMainScreen (data);
  } else {
    html += `
      <div ${generateSectionAttributes (object)}>
        ${type === 'video' ? generateVideoScreen(data) : ''}
        ${type === 'texts' ? generateTextScreen (data) : ''}
        ${type === 'singlePicture' ? generatePicturesScreen (data) : ''}
        ${type === 'doubleSide' ? generateDoubleSection (data) : ''}
        ${data.backgroundImage ? generateScreenBg (data) : ''}
      </div>
    `;
  }

  return html;
}

function generateDoubleSection (data) {
  let html = ``;

  $.each(data, function (i) {
    const
      type = data[i].type,
      contentData = data[i].content,
      object = data[i];

    html += generateSection(type, contentData, object);
  });

  return html;
}

function posDifference (id, action) {
  const
    titleSlide = $(`.slider__title:eq(${id})`),
    titleCase = $(document).find('.case__title:eq(0)');

  const
    posOne = titleSlide.offset().top,
    posTwo = titleCase.offset().top,
    ww = $(window).width(),
    posOneVW = posOne/ww*100,
    posTwoVW = posTwo/ww*100,
    diff = posOneVW-posTwoVW;

  titleCase.css({
    transition: 'none',
    transform: `translate3d(0, ${diff}vw, 0)`,
  });

  window.titleDiff = diff;

  setTimeout(() => {
    titleCase.css({
      transition: 'transform 1s ease',
      transform: `translate3d(0, 0, 0)`,
    });

    $(document).find('.case').addClass('is-active');
  }, 1000);
}

// ########################################
// ########################################

let loadAllowed = true;

export function cases () {
  $('.main__page_case').scroll(function () {
    const
      w = $(this),
      sT = w.scrollTop(),
      line = $(document).find('.case__line');

    sT > 100 ? line.addClass('is-hidden') : line.removeClass('is-hidden');

    if ((sT + w.height()) === ($('.case').height())) {
      console.log('Загрузка след. кейса');
      $(document).find('.case__main:last-child').siblings().remove();

      window.currentCase = window.currentCase+1 > (casesCount-1) ? 0 : window.currentCase+1;
      window.mySlider.slideTo(window.currentCase);

      // ##################
      function loadNextCase () {
        loadAllowed = false;

        const
          caseID = window.currentCase,
          url = '/assets/json/cases.json',
          caseContent = $('.js-page-case .case__case-content');

        $.getJSON(url, function (json) {
          const section = json[caseID].caseContent;

          $.each(section, function (i) {
            if (i > 0) {
              const
                type = section[i].type,
                data = section[i].content,
                object = section[i];

              let html = generateSection(type, data, object);

              caseContent.append(html);
            }
          });

          function addLastSection () {
            const section = json[caseID+2 > casesCount ? 0 : caseID + 1].caseContent;

            const
              type = section[0].type,
              data = section[0].content,
              object = section[0];

            let html = generateSection(type, data, object);

            caseContent.append($(html).addClass('is-last'));
          }

          addLastSection();

          setTimeout(() => {
            $('.main__page_case').scrollTop(0);
            $('.case__main:eq(0)').removeClass('is-last');
          }, 0.1);

          setTimeout(() => {
            $('.main__page_case').scrollTop(0);

            loadAllowed = true;
          }, 100);
        });
      }

      if (loadAllowed) loadNextCase();
      // ###############
    }
  });

  $(document).on('click', '.js-load-case', function () {
    const
      caseID = $(this).data('case-id'),
      url = '/assets/json/cases.json',
      caseContent = $('.js-page-case .case__case-content');

    window.currentCase = caseID;

    $('.main__page_case').scrollTop(0);
    $('.js-page-cases').addClass('is-visible');
    $(this).closest('.swiper-slide').addClass('is-case-open');

    $.getJSON(url, function (json) {
      const section = json[caseID].caseContent;

      caseContent.html('');

      $.each(section, function (i) {
        const
          type = section[i].type,
          data = section[i].content,
          object = section[i];

        let html = generateSection(type, data, object);

        caseContent.append(html);
      });

      function addLastSection () {
        const section = json[caseID+2 > casesCount ? 0 : caseID + 1].caseContent;

        const
          type = section[0].type,
          data = section[0].content,
          object = section[0];

        let html = generateSection(type, data, object);

        caseContent.append($(html).addClass('is-last'));
      }

      addLastSection();
      posDifference(caseID);
    });
  });
}
/* eslint-enable */
