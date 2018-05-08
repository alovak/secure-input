import Channel from '../../utils/channel';
import { Input, HiddenInput, TabHandler } from '../../utils/input';
import NumberInput from '../../utils/inputs/number';
import CvcInput from '../../utils/inputs/cvc';
import ExpInput from '../../utils/inputs/exp';
import generateStyle from '../../utils/style';
import isIos from '../../utils/is-ios';
import Bus from '../../utils/bus';

export default function Element(options) {
  this.options = options || {};
  this.channel = new Channel({ label: 'inner' })
  this.bus = new Bus();

  // this.channel.ping();

  this.channel.on('mount', this._mount.bind(this));

  this.channel.on('focus', this._onFocus.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();


  this.bus.on('collect', function(data, callback) {
    if (!callback) return;

    data[this.type] = this.input.value;

    callback(data);
  }.bind(this));
}

Element.prototype._mount = function(data) {
  this.type = data.type;
  this.options = data.options;

  this._createControls();
  this._applyStyle();
  this._mountEvents();

  this.channel.say('mounted');
};

Element.prototype._createControls = function() {
  const inputs = {
    number: NumberInput,
    cvc: CvcInput,
    exp: ExpInput
  };

  this.container = document.querySelector('#container');

  this.input = new inputs[this.type]({ channel: this.channel });

  this.container.append(TabHandler(function() {
    this.channel.say('focus');
  }.bind(this)));

  this.container.append(TabHandler(function() {
    this.channel.say('forwardFocus', { direction: 'backward' });
  }.bind(this)));

  this.container.append(this.input);

  this.container.append(TabHandler(function() {
    this.channel.say('forwardFocus', { direction: 'forward' });
  }.bind(this)));
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
  this.input.addEventListener('focus', function() {
    this.channel.say('focus');
  }.bind(this));

  this.input.addEventListener('blur', function() {
    this.blur();
  }.bind(this));

  window.addEventListener('blur', function() {
    if (!isIos()) return;

    const input = new HiddenInput();
    this.container.prepend(input);
    input.focus();
    input.blur();
    input.parentNode.removeChild(input);
  }.bind(this));

  document.addEventListener('focus', function(e) {
    this.channel.say('focus');
  }.bind(this));
};

Element.prototype._onFocus = function() {
  this.focus();
};

Element.prototype.focus = function() {
  if (this.isFocused) return;
  this.isFocused = true;

  this.input.focus();
};

Element.prototype.blur = function() {
  if (!this.isFocused) return;

  this.isFocused = false;

  this.channel.say('blur');
};
