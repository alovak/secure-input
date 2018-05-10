import { Input } from '../input';
import RestrictedInput from 'restricted-input';
import { expirationDate } from 'card-validator'

export default function ExpInput(options) {
  if (!options) options = {};
  if (!options.placeholder) options.placeholder = 'MM / YY';

  this.options = options;
  this.channel = options.channel;

  this._createControls();
  this._mountEvents();
}

ExpInput.prototype._createControls = function() {
  this.input = Input(this.options);
  this.formatter = new RestrictedInput({
    element: this.input,
    pattern: '{{99}} / {{99}}'
  });

  this.element = document.createElement('div');
  this.element.classList.add('PowerInput');
  this.element.appendChild(this.input);
};

ExpInput.prototype._setState = function(state) {
  this.input.parentElement.classList.add(state);
};

ExpInput.prototype._resetState = function(state) {
  this.input.parentElement.classList.remove("invalid");
  this.input.parentElement.classList.remove("complete");
};

ExpInput.prototype._mountEvents = function() {
  this.input.addEventListener('input', function(e) {
    this._resetState();

    if (this.input.value === '') {
      this.channel.say('change', { 
        type: 'exp',
        empty: true
      });

      return;
    }

    const validationResult = expirationDate(this.input.value);

    if (validationResult.isPotentiallyValid !== true) {
      this.channel.say('change', { 
        type: 'exp',
        isInvalid: true
      });

      this._setState('invalid');
    } else {

      if (validationResult.isValid === true) this._setState('complete');

      this.channel.say('change', { 
        type: 'exp',
        complete: validationResult.isValid
      });
    }
  }.bind(this));
};
