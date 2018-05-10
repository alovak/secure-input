import { Input, Image } from '../input';
import { visaIcon, unknownCardIcon, masterCardIcon, americanExpressIcon, discoverIcon, jcbIcon } from '../icons';
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

  this.options = options;
  this.channel = options.channel;

  this._createControls();
  this._mountEvents();
}

NumberInput.prototype._createControls = function() {
  this.input = Input(this.options);
  this.formatter = new RestrictedInput({
    element: this.input,
    pattern: '{{9999}} {{9999}} {{9999}} {{9999}}'
  });

  this.element = document.createElement('div');
  this.element.classList.add('PowerInput');

  this.icon = visaIcon();
  this.icon = unknownCardIcon();
  this.element.appendChild(this.input);
  this.element.appendChild(this.icon);

  this.icons = {
    unknown: unknownCardIcon,
    visa: visaIcon,
    'master-card': masterCardIcon,
    'american-express': americanExpressIcon,
    discover: discoverIcon,
    jcb: jcbIcon
  }
};

NumberInput.prototype._replaceIcon = function(brand) {
  this.icon.remove();
  this.icon = (this.icons[brand] || unknownCardIcon)();
  if (this.icon) this.element.appendChild(this.icon);
};

NumberInput.prototype._mountEvents = function() {
  this.input.addEventListener('input', function(e) {
    this.input.parentElement.classList.remove("invalid");
    this.input.parentElement.classList.remove("complete");

    if (this.input.value === '') {
      this.channel.say('change', { 
        type: 'number',
        empty: true
      });

      this._replaceIcon('unknown');

      return;
    }

    const validationResult = number(this.input.value);

    this.formatter.setPattern(generatePattern(validationResult.card));

    if (validationResult.isPotentiallyValid !== true) {
      this.channel.say('change', { 
        type: 'number',
        isInvalid: true
      });

      this.input.parentElement.classList.add("invalid");
    } else {
      if (validationResult.isValid === true) this.input.parentElement.classList.add("complete");

      let brand = validationResult.card ? validationResult.card.type : 'unknown';

      this._replaceIcon(brand);

      this.channel.say('change', { 
        type: 'number',
        complete: validationResult.isValid,
        card: {
          brand: brand
        }
      });
    }
  }.bind(this));
};
