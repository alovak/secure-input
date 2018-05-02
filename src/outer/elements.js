import Element from './element.js';
import Controller from '../controller/outer.js';

export default function Elements() {
  this.elements = {};
  this.controller = new Controller();
  this.controller.mount();
}

Elements.prototype.create = function(type, options) {
  return this.elements[type] = new Element(type, options, this);
};

Elements.prototype.createToken = function() {
  return new Promise(function() {
    this.controller.createToken();
  }.bind(this));
};
