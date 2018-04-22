import IFrame from '../utils/iframe';

export default function Element(type, options) {
  this.type = type;
  this.options = options || {};
}

Element.prototype.mount = function (elementId) {
  document.addEventListener('DOMContentLoaded', function() { this._mount(elementId) }.bind(this));
};

Element.prototype._mount = function(elementId) {
  this.container = document.querySelector(elementId);
  this.iframe = new IFrame({ src: '/iframe.html', rnd: true, height: '100px' });
  this.container.appendChild(this.iframe);
};
