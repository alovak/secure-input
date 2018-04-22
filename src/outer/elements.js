import element from './element.js';

export default function elements() {
  this.create = function(type, options) {
    return new element(type, options);
  }
}
