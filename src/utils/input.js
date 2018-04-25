export default function Input(options) {
  const el = document.createElement('input');

  options = options || {};

  if (options.name)  el.name = options.name;
  if (options.id) el.id = options.id;
  if (options.placeholder) el.placeholder = options.placeholder;

  options.type ? el.type = options.type : el.type = 'text';

  return el;
}
