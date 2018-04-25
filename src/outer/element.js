import IFrame from '../utils/iframe';
import Channel from '../utils/channel';
import Input from '../utils/input';

export default function Element(type, options) {
  this.type = type;
  this.options = options || {};
  this.channel = new Channel({ label: 'outer' })

  // for debug
  this.channel.ping();
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

  this.channel.on('mounted', function() {
    const input = new Input();
    input.value = this.channel.id;
    this.container.appendChild(input);
  }.bind(this));

  this.channel.connect({ target: this.iframe.contentWindow });
  this.channel.parentReady();
};
