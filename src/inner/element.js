import Channel from '../utils/channel';
import { Input } from '../utils/input';
import generateStyle from '../utils/style';
import isIos from '../utils/is-ios';

export default function Element(options) {
  this.options = options || {};
  this.channel = new Channel({ label: 'inner' })

  // this.channel.ping();

  this.channel.on('mount', this._mount.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();
}

Element.prototype._mount = function(data) {
  this.type = data.type;
  this.options = data.options;

  this._createControls();
  console.log('create controls');
  this._applyStyle();
  console.log('apply style');
  this._mountEvents();
  console.log('mount events');

  this.channel.say('mounted');
};

Element.prototype._createControls = function() {
  this.container = document.querySelector('#container');
  this.input = new Input();
  this.input.value = this.channel.id;

  this.container.append(this.input);
};

Element.prototype._applyStyle = function() {
  this.input.classList.add("PowerInput");

  generateStyle(this.options.style);

  this.channel.say('resize', {
    size: {
      height: this.input.getBoundingClientRect().height,
      width: this.input.getBoundingClientRect().width,
    }
  });
};

Element.prototype._mountEvents = function() {
  // trick to make blur/focus work properly
  // in iOS
  this.input.addEventListener('focus', function() {
    console.log('input:focus, say focus');
    this.channel.say('focus');
  }.bind(this));

  this.input.addEventListener('blur', function() {
    console.log('input:blur, say blur');
    this.channel.say('blur');
  }.bind(this));

  window.addEventListener('blur', function() {
    if (!isIos()) return;

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    this.container.prepend(input);
    input.focus();
    input.blur();
    input.parentNode.removeChild(input);
  }.bind(this));

};
