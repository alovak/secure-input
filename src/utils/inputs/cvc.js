import { Input } from '../input';
import RestrictedInput from 'restricted-input';
import { cvv } from 'card-validator'

export default function CvcInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'CVC';

  const el = Input(options);

  new RestrictedInput({
    element: el,
    pattern: '{{9999}}'
  });

  el.addEventListener('input', function(e) {
    if (el.value === '') {
      options.channel.say('change', { 
        type: 'exp',
        empty: true
      });

      return;
    }

    const validationResult = cvv(el.value);

    el.classList.remove("invalid");
    el.classList.remove("complete");

    if (validationResult.isPotentiallyValid !== true) {
      options.channel.say('change', { 
        type: 'cvc',
        isInvalid: true
      });

      el.classList.add("invalid");
    } else {

      if (validationResult.isValid === true) el.classList.add("complete");

      options.channel.say('change', { 
        type: 'cvc',
        complete: validationResult.isValid
      });
    }
  });

  return el;
}
