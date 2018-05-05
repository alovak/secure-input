import Elements from './element/elements';
import Config from './config';

export default function PowerPayments() {
  return {
    elements: function() {
      return new Elements();
    }
  }
}
