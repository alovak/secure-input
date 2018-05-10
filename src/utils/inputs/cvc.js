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

  this.options = options;
  this.channel = options.channel;
  this.maxLength = 3;

  this._createControls();
  this._mountEvents();
}

CvcInput.prototype._createControls = function() {
  this.input = Input(this.options);
  this.formatter = new RestrictedInput({
    element: this.input,
    pattern: '{{999}}'
  });

  this.element = document.createElement('div');
  this.element.classList.add('PowerInput');
  this.element.appendChild(this.input);
};

CvcInput.prototype._setState = function(state) {
  this.input.parentElement.classList.add(state);
};

CvcInput.prototype._resetState = function(state) {
  this.input.parentElement.classList.remove("invalid");
  this.input.parentElement.classList.remove("complete");
};

CvcInput.prototype._mountEvents = function() {
  this.input.addEventListener('input', function(e) {
    this._resetState();

    if (this.input.value === '') {
      this.channel.say('change', { 
        type: 'cvc',
        empty: true
      });

      return;
    }

    const validationResult = cvv(this.input.value, this.maxLength);

    if (validationResult.isPotentiallyValid !== true) {
      this.channel.say('change', { 
        type: 'cvc',
        isInvalid: true
      });

      this._setState('invalid');
    } else {

      if (validationResult.isValid === true) this._setState('complete');

      this.channel.say('change', { 
        type: 'cvc',
        complete: validationResult.isValid
      });
    }
  }.bind(this));

  this.channel.on('updateValidation', function(data) {
    const brand = (data && data.brand && data.brand !== 'unknown') ? data.brand : 'visa';
    const type = creditCardType.getTypeInfo(brand);

    this.input.placeholder = type.code.name;
    this.formatter.setPattern(generatePattern(type.code.size));
    this.maxLength = type.code.size;

    this.input.setAttribute('maxlength', this.maxLength);
  }.bind(this));
};
