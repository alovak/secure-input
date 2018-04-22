import channel from './channel';
import { tabHandler, createInvisibleInput } from './inner/inputs';

var IFRAME_URL = 'iframe.html';

export default function element(type, options) {

  this.type = type;
  this.options = options;
  this.id = 'input' + (Math.random() * 1e9 | 0).toString();
  this.channel = new channel();

  this.mount = function(id) {
    document.addEventListener("DOMContentLoaded", () => {
      this.container = document.querySelector(id);

      this.container.appendChild(this.createIFrame());

      this.container.appendChild(this.safariTabHandler = createInvisibleInput({ tabIndex: "-1", className: 'PowerElement--safari' }));

      this.container.appendChild(this.tabHandler = tabHandler(() => {
        console.log('tab handler focused');
        this.channel.say('focus');
      }));


      this.channel.connect({ target: this.iframe.contentWindow, id: this.id });
      this.channel.say('mount', { type: type, options: options });
    });
  };

  this.createIFrame = function () {
    var iframe = document.createElement('iframe');
    iframe.name = this.id;
    iframe.setAttribute('style', [
      'border:0',
      'margin:0',
      'padding:0',
      'background:transparent',
      'display:block',
      'width: 1px',
      'min-width: 100%',
      'overflow: hidden',
      ''
    ].join('!important;'));

    iframe.src = IFRAME_URL + "?rnd=" + (Math.random() * 1e9 | 0);

    // iframe.width = '1px';
    iframe.height = '100px';
    iframe.frameborder = '0';
    iframe.allowTransparency = 'true';
    iframe.scrolling = "no";

    this.iframe = iframe;

    return iframe;
  };

  this.mountEvents = function() {
    const containerId = this.container.getAttribute("id");
    const label = (containerId && document.querySelector("label[for=" + containerId + "]"));

    // if (label) label.addEventListener('click', () => {
    //   this.channel.say('focus');
    // });

    this.container.addEventListener('click', () => {
      this.channel.say('focus');
    });

    this.iframe.addEventListener('focus', function() {
      console.log('focus on iframe');
    });
  };

  this.channel.on('mounted', data => {
    this.iframe.height = data.size.height;

    this.container.classList.add("PowerElement");
    this.mountEvents();
  });

  this.channel.on('resize', data => {
    this.iframe.height = data.size.height;
  });

  this.channel.on('focus', () => {
    this.container.classList.add("PowerElement--focus");
  });

  this.channel.on('blur', () => {
    this.container.classList.remove("PowerElement--focus");
  });

  this.channel.on('forwardFocus', (data) => {
    console.log('got forwardFocus: ', data.direction);
    // https://allyjs.io/data-tables/focusable.html#iframe-element
    const focusable = Array.prototype.slice.call(document.querySelectorAll("a[href], area[href], button:not([disabled]), embed, input:not([disabled]), object, select:not([disabled]), textarea:not([disabled]), *[tabindex], *[contenteditable]"));

    const focusableElements = [];

    focusable.forEach(function(el) {
      const tabIndex = el.getAttribute("tabindex");
      console.log('index: ', tabIndex);
      if (!tabIndex || parseInt(tabIndex, 10) >= 0) {
        focusableElements.push(el);
      }
    });

    console.log(focusableElements);
    console.log(focusableElements[1]);
    console.log(this.tabHandler);

    if (focusableElements[1] == this.tabHandler) console.log('equal!!!');

    const elementIndex = focusableElements.indexOf(this.tabHandler);
    if (elementIndex > 0) console.log('positive');
    if (elementIndex < 0) console.log('negative');
    console.log('current element index: ' + elementIndex);
    let nextIndex = elementIndex + (data.direction == 'forward' ? 1 : -1);

    console.log('next index supposed ', nextIndex);

    if (nextIndex > focusableElements.length - 1) nextIndex = 0;

    console.log('next index calculated ', nextIndex);
    focusableElements[nextIndex].focus();
  });
}
