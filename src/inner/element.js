import Channel from '../utils/channel';
import Input from '../utils/input';
import generateStyle from '../utils/style';

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
  this._applyStyle();
  this._mountEvents();

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
  this.input.addEventListener('blur', function() {
    console.log('blur input');
  });

  // trick to make blur/focus work properly
  // in iOS
  window.addEventListener('blur', function() {
    let input = document.createElement('input');
    input.id = 'blur--element';
    input.setAttribute('type', 'text');
    this.container.prepend(input);
    input.focus();
    input.parentNode.removeChild(input);
  }.bind(this));

  this.input.addEventListener('focus', function() {
    console.log('focus element');
  });
};
