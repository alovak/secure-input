import { Input } from '../input';
import RestrictedInput from 'restricted-input';

export default function NumberInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'Card number';

  const el = Input(options);

  new RestrictedInput({
    element: el,
    pattern: '{{9999}} {{9999}} {{9999}} {{9999}}'
  });

  return el;
}
