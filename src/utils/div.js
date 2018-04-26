export default function Div(options) {
  const el = document.createElement('div');

  options = options || {};

  if (options.id) el.id = options.id;
  if (options.class) el.classList.add(options.class);

  return el;
}

