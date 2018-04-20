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

      this.container.appendChild(this.tabHandler = tabHandler(() => {
        this.channel.say('focus');
      }));

      this.container.appendChild(this.safariTabHandler = createInvisibleInput({ tabIndex: "-1", className: 'PowerElement--safari' }));

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

    iframe.src = IFRAME_URL + "#style[base]=1";

    // iframe.width = '1px';
    iframe.height = '1px';
    iframe.frameborder = '0';
    iframe.allowTransparency = 'true';
    iframe.scrolling = "no";

    this.iframe = iframe;

    return iframe;
  };

  this.mountEvents = function() {
    const containerId = this.container.getAttribute("id");
    const label = (containerId && document.querySelector("label[for=" + containerId + "]"));

    if (label) label.addEventListener('click', () => {
      this.channel.say('focus');
    });

    this.container.addEventListener('click', () => {
      this.channel.say('focus');
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
    // https://allyjs.io/data-tables/focusable.html#iframe-element
    const focusable = Array.prototype.slice.call(document.querySelectorAll("a[href], area[href], button:not([disabled]), embed, input:not([disabled]), object, select:not([disabled]), textarea:not([disabled]), *[tabindex], *[contenteditable]"));

    const elementIndex = focusable.indexOf(this.tabHandler);
    let nextIndex = elementIndex + (data.direction == 'forward' ? 1 : -1);

    if (nextIndex > focusable.length - 1) nextIndex = 0;

    focusable[nextIndex].focus();
  });

  window.addEventListener('focus', function(e) {
    console.log(this);
    console.log('focus: ', e);
  });
}
