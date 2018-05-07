import { Input } from '../input';
import RestrictedInput from 'restricted-input';

export default function ExpInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'MM / YY';

  const el = Input(options);

  new RestrictedInput({
    element: el,
    pattern: '{{99}} / {{99}}'
  });

  return el;
}
