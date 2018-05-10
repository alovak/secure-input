import { Input } from '../input';
import RestrictedInput from 'restricted-input';
import { expirationDate } from 'card-validator'

export default function ExpInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'MM / YY';

  const el = Input(options);

  new RestrictedInput({
    element: el,
    pattern: '{{99}} / {{99}}'
  });

  el.addEventListener('input', function(e) {
    if (el.value === '') {
      options.channel.say('change', { 
        type: 'exp',
        empty: true
      });

      return;
    }

    const validationResult = expirationDate(el.value);

    el.classList.remove("invalid");
    el.classList.remove("complete");

    if (validationResult.isPotentiallyValid !== true) {
      options.channel.say('change', { 
        type: 'exp',
        isInvalid: true
      });

      el.classList.add("invalid");
    } else {

      if (validationResult.isValid === true) el.classList.add("complete");

      options.channel.say('change', { 
        type: 'exp',
        complete: validationResult.isValid
      });
    }
  });

  return el;
}
