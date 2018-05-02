import IFrame from '../utils/iframe';
import Channel from '../utils/channel';
import { Input, HiddenInput } from '../utils/input';
import isIos from '../utils/is-ios';
import Div from '../utils/div';

export default function Element(type, options, elements) {
  this.type = type;
  this.options = options || {};
  this.channel = new Channel({ label: 'outer' })
  this.elements = elements;

  // for debug
  // this.channel.ping();

  this.channel.on('mounted', this._onMounted.bind(this));
  this.channel.on('resize', this._onResize.bind(this));
  this.channel.on('focus', this._onFocus.bind(this));
  this.channel.on('blur', this._onBlur.bind(this));

  this.channel.on('forwardFocus', this._onForwardFocus.bind(this));
}

Element.prototype.mount = function (elementId) {
  if ("complete" === document.readyState) {
    this._mount(elementId)
  } else {
    document.addEventListener('readystatechange', function(event) {
      if (event.target.readyState === "complete" || event.target.readyState === "interactive") {
        this._mount(elementId)
      }
    }.bind(this));
  }

  return this;
};

Element.prototype._mount = function(containerId) {
  if (this.isMounted) return;

  this.isMounted = true;

  this._createControls(containerId);


  this._mountEvents();

  this.channel.say('mount', { type: this.type, options: this.options });

  this.channel.connect({ target: this.iframe.contentWindow });
  this.channel.parentReady();
};

Element.prototype._createControls = function(containerId) {
  this.container = document.querySelector(containerId);
  this.container.classList.add("PowerElement");

  this.privateContainer = new Div({ class: 'PowerElement--private' });
  this.privateInput = new HiddenInput({ class: 'PowerElement--private--input' });
  this.privateInputSafari = new HiddenInput({ class: 'PowerElement--private--input--safari', tabIndex: '-1' });
  this.iframe = new IFrame({ src: '/iframe.html', rnd: true, height: '1px' });

  this.container.appendChild(this.privateContainer);

  this.privateContainer.appendChild(this.iframe);
  this.privateContainer.appendChild(this.privateInput);
  this.privateContainer.appendChild(this.privateInputSafari);
  this.privateInput.value = '123';
};

Element.prototype._mountEvents = function() {
  this.privateInput.addEventListener('focus', function(e) {
    this.focus();
  }.bind(this), true);
};

Element.prototype._onMounted = function(data) {
};

Element.prototype.focus = function() {
  if (this.isFocused) return;

  this.isFocused = true;
  this.privateInput.focus();
  this.container.classList.add("PowerElement--focus");
  this.channel.say('focus');
};


Element.prototype._onResize = function(data) {
  this.iframe.height = data.size.height;
};

Element.prototype._onFocus = function() {
  this.focus();
};

Element.prototype.blur = function() {
  if (!this.isFocused) return;

  this.container.classList.remove("PowerElement--focus");
  this.isFocused = false;

  if (!isIos()) return;

  this.privateInputSafari.focus();
  this.privateInputSafari.blur();
};

Element.prototype._onBlur = function() {
  this.blur();
};


Element.prototype._onForwardFocus = function(data) {
  // https://allyjs.io/data-tables/focusable.html#iframe-element
  const focusable = Array.prototype.slice.call(document.querySelectorAll("a[href], area[href], button:not([disabled]), embed, input:not([disabled]), object, select:not([disabled]), textarea:not([disabled]), *[tabindex], *[contenteditable]"));

  const focusableElements = [];

  focusable.forEach(function(el) {
    const tabIndex = el.getAttribute("tabindex");
    if (!tabIndex || parseInt(tabIndex, 10) >= 0) {
      focusableElements.push(el);
    }
  });

  const elementIndex = focusableElements.indexOf(this.privateInput);
  let nextIndex = elementIndex + (data.direction == 'forward' ? 1 : -1);

  if (nextIndex > focusableElements.length - 1) nextIndex = 0;

  focusableElements[nextIndex].focus();
};
