import IFrame from '../utils/iframe';
import Channel from '../utils/channel';
import Input from '../utils/input';
import isIos from '../utils/is-ios';

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

Element.prototype._mount = function(elementId) {
  if (this.isMounted) return;

  this.isMounted = true;

  this.container = document.querySelector(elementId);
  this.iframe = new IFrame({ src: '/iframe.html', rnd: true, height: '100px' });
  this.container.appendChild(this.iframe);

  this.channel.say('mount', { type: this.type, options: this.options });

  this.channel.connect({ target: this.iframe.contentWindow });
  this.channel.parentReady();
};

Element.prototype._onMounted = function(data) {
  const input = new Input();
  input.value = this.channel.id;
  this.container.parentElement.appendChild(input);

  this.container.classList.add("PowerElement");
};

Element.prototype._onResize = function(data) {
  this.iframe.height = data.size.height;
};

Element.prototype._onFocus = function() {
  this.container.classList.add("PowerElement--focus");

  // console.log('focused');
  // var val = isIos();
  // console.log('isIos', val);

  // if (!isIos()) return;

  // console.log('try to do a trick');

  // const input = document.createElement('input');
  // input.id = 'focus--trick';
  // input.setAttribute('type', 'text');
  // this.container.prepend(input);
  // input.focus();
  // // input.blur();
  // input.parentNode.removeChild(input);
};

Element.prototype._onBlur = function() {
  this.container.classList.remove("PowerElement--focus");
};

