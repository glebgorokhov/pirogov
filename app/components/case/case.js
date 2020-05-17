/* eslint-disable */
const $ = window.$;

import {freeze, unfreeze} from "../../blocks/js-functions/freeze";

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
        
        <!-- 
        <div class="case__main-video">
            <div class="case__main-video-wrapper">
              <video class="js-case-main-video" src="${data.video}" muted="muted" playsinline="playsinline" preload="auto" autoplay="autoplay"></video>
            </div>
        </div>
        -->
    </div>
  `;

  return html;
}

function generateVideoScreen (data) {
  const html = `
     <div class="case__video is-loading">
       <video src="${data.video}" style="${data.videoWidth ? 'max-width: ' + data.videoWidth + 'px;' : ''}" autoplay="autoplay" loop="loop" muted="muted" playsinline="playsinline" preload="auto"></video>
       <div class="case__video-preloader"><span></span></div>
     </div>
  `;

  return html;
}

function generateTextScreen (data) {
  const html = `
     <div class="case__texts ${data.centeredText ? 'case__texts_centered' : ''}">
         <h2 class="case__case-title">${data.title}</h2>
         <p class="case__case-text">${data.text}</p>
     </div>
  `;

  return html;
}

function generatePicturesScreen (data) {
  const html = `
    <div class="case__picture">
      <img src="${data.image}" style="${data.imageWidth ? 'width: ' + data.imageWidth + 'px;' : ''}">
    </div>
  `;

  return html;
}

function generateScreenBg (data) {
  const html = `
    <div class="case__background-image">
      <div class="case__background-image_container" style="background-image: url(${data.backgroundImage}); ${data.backgroundSize ? ('background-size: ' + data.backgroundSize + ';') : ''} ${data.backgroundRepeat ? ('background-repeat: ' + data.backgroundRepeat + ';') : ''} ${data.backgroundPosition ? ('background-position: ' + data.backgroundPosition + ';') : ''}"></div>
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

function generateBackgroundVideo (data) {
  const html = `
     <div class="case__video case__video-background is-loading">
       <video src="${data.backgroundVideo}" autoplay="autoplay" loop="loop" muted="muted" playsinline="playsinline" preload="auto"></video>
       <div class="case__video-preloader"><span></span></div>
     </div>
  `;

  return html;
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
        ${data.backgroundVideo ? generateBackgroundVideo (data) : ''}
        ${data.backgroundImage ? generateScreenBg (data) : ''}
      </div>
    `;
  }

  console.log(data.backgroundVideo);

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
    titleCase = $(document).find('.case__title:eq(0) span');

  const
    diff = 10;

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

function videoLoader () {
  $(document).find('.case__video.is-loading').each(function () {
    const
      block = $(this),
      video = block.find('video');

    video.on('canplaythrough playing', function () {
      block.removeClass('is-loading');
    });

    // if (video.readyState > 3) {
    //   block.removeClass('is-loading');
    // }
  });
}

function mainScreenHeight() {
  $(document).find('.case__main').css({
    minHeight: $(document).find('.main__page_case').outerHeight() + 'px',
  });
}

// ########################################
// ########################################

let loadAllowed = true;

export function loadCase (caseID) {
  const
    url = '/assets/json/cases.json',
    caseContent = $('.js-page-case .case__case-content');

  window.currentCase = caseID;

  $('.main__page_case').scrollTop(0);

  $(document).find(`.swiper-slide:eq(${caseID})`).addClass('is-case-open');

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
    videoLoader();
    posDifference(caseID);
    mainScreenHeight();
  });
}

export function cases () {
  $(window).resize(mainScreenHeight);

  $('.main__page_case').scroll(function () {
    const
      w = $(this),
      sT = w.scrollTop(),
      line = $(document).find('.case__line');

    sT > 100 ? line.addClass('is-hidden') : line.removeClass('is-hidden');

    // Анимация текстов
    $(this).find('.case__case-title, .case__case-text').each(function () {
      const cont = $(this);

      if (cont.hasClass('is-active')) return;

      if ($(this).offset().top < $(window).height()*0.9) {
        cont.addClass('is-active');
      }
    });

    // Анимация для бэкграундов
    $(this).find('.case__background-image').each(function () {
      const cont = $(this).find('.case__background-image_container');

      if (cont.hasClass('is-active')) return;

      if ($(this).offset().top < $(window).height()/2) {
        cont.addClass('is-active');
      }
    });

    // Когда доскроллили кейс до конца
    if ((sT + w.height()) > ($('.case').height() - 1)) {

      // ##################
      function loadNextCase () {
        loadAllowed = false;
        console.log('Загрузка след. кейса');
        window.currentCase = window.currentCase+1 > (casesCount-1) ? 0 : window.currentCase+1;
        $(document).find('.case__main:last-child').siblings().remove();
        window.mySlider.slideTo(window.currentCase);
        $('.lottie').removeClass('is-clickable').addClass('is-hidden');

        const
          caseID = window.currentCase,
          url = '/assets/json/cases.json',
          caseContent = $(document).find('.js-page-case .case__case-content');

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
          videoLoader();

          setTimeout(() => {
            $('.case').addClass('is-loading');
            freeze();
          }, 0.1);

          setTimeout(() => {
            $('.case').removeClass('is-loading');
            $('.case__main:eq(0)').removeClass('is-last');
            unfreeze();
            $('.lottie').addClass('is-clickable').removeClass('is-hidden');
          }, 5000);

          setTimeout(() => {
            loadAllowed = true;
          }, 8000);
        });
      }

      if (loadAllowed) loadNextCase();
      // ###############
    }
  });
}
/* eslint-enable */
