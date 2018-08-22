'use strict';

var loader = document.querySelector('.configs__loader');

function getConfig() {
  var container = document.querySelector('.configs__table');
  var templateHtml = '<div class="configs__table-row"><div class="column column--big"><div class="configs__name">Процессор</div><div class="column__text configs__processor">Intel Xeon E5-1650v4 3.6 ГГц</div></div><div class="column column--middle"><div class="configs__name">Жесткий диск</div><div class="column__text configs__hdd">512 ГБ</div></div><div class="column column--middle"><div class="configs__name">Память</div><div class="column__text configs__memory">512 ГБ</div></div><div class="column column--large"><div class="configs__name">Цена</div><div class="column__text configs__price">12 000 ₽/мес.</div></div><div class="column column--small"><a class="btn" href="https://selectel.ru/ " target="_blank">Заказать</a></div></div>';

  var template = document.createElement('div');
  var xhr = new XMLHttpRequest();
  var URL = 'https://api.jsonbin.io/b/5b683d097b212953678c03dd';
  template.innerHTML = templateHtml;
  template = template.firstElementChild;
  xhr.open('GET', URL, true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;
    loader.classList.add('configs__loader--hidden');
    if (xhr.status == 200) {
      var serverResponse = xhr.responseText;
      var serverJsonParsed = JSON.parse(serverResponse);
      renderConfig(serverJsonParsed);
    } else {
      var error = document.createElement('div');
      error.classList.add('errorMessage');
      error.textContent = 'Ошибка соединения';
      container.appendChild(error);
    }
  }

  function formatPrice(str) {
    return str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  }

  function renderConfig(configData) {
    var fragment = document.createDocumentFragment();
    configData.forEach(function(item) {
      var element = template.cloneNode(true);
      var processor = element.querySelector('.configs__processor');
      var hdd = element.querySelector('.configs__hdd');
      var memory = element.querySelector('.configs__memory');
      var price = element.querySelector('.configs__price');
      processor.textContent = item.cpu;
      hdd.textContent = item.hdd + ' ГБ';
      memory.textContent = item.ram + ' ГБ';
      price.textContent = formatPrice(item.price / 100) + ' ₽/мес.';
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }
}

getConfig();