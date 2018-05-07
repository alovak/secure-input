import Element from './outer/element.js';
import Controller from '../controller/outer.js';

export default function Elements() {
  // this.elements = {};
  this.ids = [];
  this.controller = new Controller();
  this.controller.mount();
}

Elements.prototype.create = function(type, options) {
  const el = new Element(type, options, this);
  this.ids.push(el.id);

  return el;
};

Elements.prototype.createToken = function(callback) {
  return new Promise(function(resolve, reject) {
    this.controller.createToken(this.ids, callback || resolve);
  }.bind(this));
};
