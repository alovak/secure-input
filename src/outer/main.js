import elements from './elements.js';

console.log('set main focus listener');

export default function PowerPayments() {
  function createToken(element) {
    console.log('create token starting from element: ', element.id);
  }

  function setup() {
  }

  setup();


  return {
    elements: function() {
      return new elements();
    },
    createToken: createToken
  }

}
