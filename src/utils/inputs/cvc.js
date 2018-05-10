import { Input } from '../input';
import RestrictedInput from 'restricted-input';
import { cvv, creditCardType } from 'card-validator'

var PATTERN_CACHE = {};

function generatePattern(length) {
  var i;
  var pattern = '{{';

  if (length in PATTERN_CACHE) {
    return PATTERN_CACHE[length];
  }

  for (i = 0; i < length; i++) {
    pattern += '9';
  }

  PATTERN_CACHE[length] = pattern + '}}';

  return PATTERN_CACHE[length];
}

export default function CvcInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'CVV';

  const el = Input(options);

  const formatter = new RestrictedInput({
    element: el,
    pattern: '{{999}}'
  });

  let maxLength = 3;

  options.channel.on('updateValidation', function(data) {
    const brand = (data && data.brand && data.brand !== 'unknown') ? data.brand : 'visa';
    const type = creditCardType.getTypeInfo(brand);

    el.placeholder = type.code.name;
    formatter.setPattern(generatePattern(type.code.size));
    maxLength = type.code.size;

    el.setAttribute('maxlength', maxLength);
  });

  el.addEventListener('input', function(e) {
    if (el.value === '') {
      options.channel.say('change', { 
        type: 'exp',
        empty: true
      });

      return;
    }

    const validationResult = cvv(el.value, maxLength);

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
