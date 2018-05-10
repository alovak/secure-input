function Input(options) {
  const el = document.createElement('input');

  options = options || {};

  if (options.name)  el.name = options.name;
  if (options.id) el.id = options.id;
  if (options.placeholder) el.placeholder = options.placeholder;
  if (options.class) el.classList.add(options.class);

  options.type ? el.type = options.type : el.type = 'text';

  return el;
}

function HiddenInput(options) {
  const el = document.createElement('input');

  options = options || {};

  if (options.name)  el.name = options.name;
  if (options.id) el.id = options.id;
  if (options.placeholder) el.placeholder = options.placeholder;
  if (options.class) el.classList.add(options.class);
  if (options.tabIndex) el.tabIndex = options.tabIndex;

  options.type ? el.type = options.type : el.type = 'text';

  el.setAttribute('style', [
    'border: none',
    'position: absolute',
    'top: 0px',
    'left: 0px',
    'height: 1px',
    'margin: 0px',
    'padding: 0px',
    'background:transparent',
    'display:block',
    'width: 100%',
    'opacity: 0',
    'background: transparent none repeat scroll 0% 0%',
    'pointer-events: none',
    'overflow: hidden',
    ''
  ].join('!important;'));

  return el;
}

function TabHandler(onFocusHandler) {
  const el = HiddenInput();

  if (onFocusHandler) {
    el.addEventListener('focus', function(event) {
      onFocusHandler(event);
    });
  }

  return el;
}

function Image(options) {
  const el = document.createElement('img');

  options = options || {};

  if (options.name)  el.name = options.name;
  if (options.id) el.id = options.id;
  if (options.class) el.classList.add(options.class);
  if (options.src) el.classList.add(options.src);

  return el;
}

export { Input, HiddenInput, TabHandler }
