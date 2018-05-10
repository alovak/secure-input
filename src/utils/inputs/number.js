import { Input } from '../input';
import RestrictedInput from 'restricted-input';
import { number, creditCardType } from 'card-validator'

// for now 19 digits card number is more confusing
// rather than useful. As example:
// 4242 4242 4242 4241 is invalid for 16 digits card
// but is possibly valid for 19 digits card...
function updateVisaMaxLength() {
  var visa = creditCardType.getTypeInfo(creditCardType.types.VISA);

  visa.lengths = [16];
  visa.prefixPattern = /^4$/;
  visa.exactPattern = /^4\d*$/;

  creditCardType.addCard(visa);
}

updateVisaMaxLength();

const PATTERN_CACHE = {};

function generatePattern(card) {
  let i, pattern;
  let gaps = [4, 8, 12];
  let length = 16;
  let type = 'unknown';

  if (card) {
    length = Math.max.apply(null, card.lengths);
    gaps = card.gaps;
    type = card.type;
  }

  if (type in PATTERN_CACHE) {
    return PATTERN_CACHE[type];
  }

  pattern = '{{';

  for (i = 0; i < length; i++) {
    if (gaps.indexOf(i) !== -1) {
      pattern += '}} {{';
    }

    pattern += '9';
  }

  PATTERN_CACHE[type] = pattern + '}}';

  return PATTERN_CACHE[type];
}

export default function NumberInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'Card number';

  const el = Input(options);

  const formatter = new RestrictedInput({
    element: el,
    pattern: '{{9999}} {{9999}} {{9999}} {{9999}}'
  });

  el.addEventListener('input', function(e) {
    if (el.value === '') {

      options.channel.say('change', { 
        type: 'number',
        empty: true
      });

      return;
    }

    const validationResult = number(el.value);

    formatter.setPattern(generatePattern(validationResult.card));

    el.classList.remove("invalid");
    el.classList.remove("complete");

    if (validationResult.isPotentiallyValid !== true) {
      options.channel.say('change', { 
        type: 'number',
        isInvalid: true
      });

      el.classList.add("invalid");
    } else {

      if (validationResult.isValid === true) el.classList.add("complete");

      options.channel.say('change', { 
        type: 'number',
        complete: validationResult.isValid,
        card: {
          brand: validationResult.card.type
        }
      });
    }
  });

  return el;
}
