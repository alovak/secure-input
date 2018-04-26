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

export { Input, HiddenInput }
