import IFrame from '../utils/iframe';
import Channel from '../utils/channel';
import { Input, HiddenInput } from '../utils/input';
import isIos from '../utils/is-ios';
import Div from '../utils/div';

export default function Element(type, options) {
  this.type = type;
  this.options = options || {};
  this.channel = new Channel({ label: 'outer' })

  // for debug
  // this.channel.ping();

  this.channel.on('mounted', this._onMounted.bind(this));
  this.channel.on('resize', this._onResize.bind(this));
  this.channel.on('focus', this._onFocus.bind(this));
  this.channel.on('blur', this._onBlur.bind(this));
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
  this.privateInputSafari = new HiddenInput({ class: 'PowerElement--private--input--safari' });
  this.iframe = new IFrame({ src: '/iframe.html', rnd: true, height: '100px' });

  this.container.appendChild(this.privateContainer);

  this.privateContainer.appendChild(this.iframe);
  this.privateContainer.appendChild(this.privateInput);
  this.privateContainer.appendChild(this.privateInputSafari);
  this.privateInput.value = '123';
};

Element.prototype._mountEvents = function() {
  this.iframe.addEventListener('blur', function(e) {
    console.log('iframe blur', e);
  }, true);

  this.iframe.addEventListener('click', function(e) {
    console.log('iframe click', e);
  }, true);

  this.iframe.addEventListener('focus', function(e) {
    console.log('iframe focus', e);
  }, true);

  this.container.addEventListener('focus', function(e) {
    console.log('container focus', e);
  }, true);

  this.privateInput.addEventListener('focus', function(e) {
    console.log('privateInput focus', e);
    this.channel.say('focus');
  }.bind(this), true);

  this.privateInput.addEventListener('blur', function(e) {
    console.log('privateInput blur', e);
  }, true);
};

Element.prototype._onMounted = function(data) {
};

Element.prototype._onResize = function(data) {
  this.iframe.height = data.size.height;
};

Element.prototype._onFocus = function() {
  this.container.classList.add("PowerElement--focus");

  const isFocused = (document.activeElement === this.iframe || document.activeElement === this.privateInput);

  if (!isFocused) {
    this.privateInput.focus();
  }
};

Element.prototype._onBlur = function() {
  const isFocused = (document.activeElement === this.iframe || document.activeElement === this.privateInput);

  if (!isFocused) {
    this.container.classList.remove("PowerElement--focus");
  }
};
