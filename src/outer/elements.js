import Element from './element.js';

export default function Elements() {
}

Elements.prototype.create = function(type, options) {
  return new Element(type, options);
};
