import IFrame from '../utils/iframe';
import Channel from '../utils/channel';

export default function Controller() {
  this.channel = new Channel({ label: 'outer_controller' })
}

Controller.prototype.mount = function (elementId) {
  if ("complete" === document.readyState) {
    this._mount()
  } else {
    document.addEventListener('readystatechange', function(event) {
      if (event.target.readyState === "complete" || event.target.readyState === "interactive") {
        this._mount()
      }
    }.bind(this));
  }

  return this;
};

Controller.prototype._mount = function(containerId) {
  if (this.isMounted) return;

  this.isMounted = true;

  this._createControls();

  this.channel.connect({ target: this.iframe.contentWindow });
  this.channel.parentReady();
};

Controller.prototype._createControls = function(containerId) {
  this.iframe = new IFrame({ src: '/controller.html', rnd: true, height: '0px' });

  document.body.appendChild(this.iframe);
};

Controller.prototype.createToken = function(elementsIds) {
  const frames = Array.prototype.slice.call(window.frames);
  console.log('1');
  const framesIds = elementsIds.map(function(frameId) {
    return frames.indexOf(document.getElementById(frameId).contentWindow);
  });

  console.log('2');

  this.channel.say('tokenize', framesIds);

  console.log('3');
};

