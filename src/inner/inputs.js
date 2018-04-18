function addInputEvents(el, channel) {
  el.addEventListener('focus', function(event) {
    channel.say('focus');
  });

  el.addEventListener('blur', function(event) {
    channel.say('blur');
  });
}

function number(params) {
  const el = document.createElement('input');

  console.log(params);

  el.placeholder = params.options.placeholder;
  el.setAttribute('maxLength', '19');

  addInputEvents(el, params.channel);

  this.element = el;
}

function tabHandler(onFocusHandler) {
  const el = document.createElement('input');
  el.setAttribute("disabled", "");
  el.autocomplete = "off";

  el.setAttribute('style', [
    'border:0',
    'margin:0',
    'padding:0',
    'background:transparent',
    'display:block',
    'width: 1px',
    'height: 1px',
    'opacity: 0',
    'position: absolute;',
    'top: -20px',
    'left: -20px',
    'pointer-events: none',
    ''
  ].join('!important;'));

  el.addEventListener('focus', function(event) {
    onFocusHandler(event);
  });

  return el;
}

export { number, tabHandler };
