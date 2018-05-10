import Element from './outer/element.js';
import Controller from '../controller/outer.js';

export default function Elements() {
  this.elements = {};
  this.ids = [];
  this.controller = new Controller();
  this.controller.mount();
  this.isNumberAndCvcLinked = false;
}

Elements.prototype.create = function(type, options) {
  const el = new Element(type, options, this);
  this.ids.push(el.id);
  this.elements[type] = el;

  this._linkCrossElements();

  return el;
};

Elements.prototype.createToken = function(callback) {
  return new Promise(function(resolve, reject) {
    this.controller.createToken(this.ids, callback || resolve);
  }.bind(this));
};

Elements.prototype._linkCrossElements = function() {
  if (this.isNumberAndCvcLinked) return;

  if (!this.elements.number || !this.elements.cvc) return;

  this.isNumberAndCvcLinked = true;

  this.elements.number.addEventListener('change', function(data) {
    if (data.empty) this.elements.cvc.channel.say('updateValidation');

    if (data.card && data.card.brand) {
      this.elements.cvc.channel.say('updateValidation', { brand: data.card.brand });
    }
  }.bind(this));
};
