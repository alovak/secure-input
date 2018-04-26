import Elements from './elements.js';

export default function PowerPayments() {
  return {
    elements: function() {
      return new Elements();
    }
  }
}

window.addEventListener('click', function(e) {
  console.log('active element', document.activeElement);
  console.log('window click', e);
});

window.addEventListener('blur', function(e) {
  console.log('active element', document.activeElement);
  console.log('window blur', e);
});

window.addEventListener('blur', function(e) {
  console.log('active element', document.activeElement);
  console.log('window blur capture', e);
}, true);

window.addEventListener('focus', function(e) {
  console.log('active element', document.activeElement);
  console.log('window focus', e);
});

window.addEventListener('focus', function(e) {
  console.log('window focus capture', e);
}, true);
