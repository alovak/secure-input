import Element from './element';

function setup() {
  new Element();
}

if ("complete" === document.readyState) {
  setup();
} else {
  document.addEventListener('readystatechange', function(event) {
    if (event.target.readyState === "complete" || event.target.readyState === "interactive") {
      setup();
    }
  });
}
