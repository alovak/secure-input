import { Input } from '../input';
import RestrictedInput from 'restricted-input';

export default function CvcInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'CVC';

  const el = Input(options);

  new RestrictedInput({
    element: el,
    pattern: '{{9999}}'
  });

  return el;
}
