import Channel from '../utils/channel';
import Input from '../utils/input';

export default function Element(options) {
  this.options = options || {};
  this.channel = new Channel({ label: 'inner' })

  this.channel.ping();

  this.channel.on('mount', this._mount.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();
}

Element.prototype._mount = function(data) {
  this.type = data.type;
  this.options = data.options;

  this._createControls();
  this._mountEvents();
  this.channel.say('mounted');
};

Element.prototype._createControls = function() {
  this.container = document.querySelector('#container');
  this.input = new Input();
  this.input.value = this.channel.id;

  this.container.append(this.input);
};

Element.prototype._mountEvents = function() {
};
