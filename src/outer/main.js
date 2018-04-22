import Elements from './elements.js';

export default function PowerPayments() {
  return {
    elements: function() {
      return new Elements();
    }
  }
}
