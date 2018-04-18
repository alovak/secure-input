import channel from '../channel';
import generateStyle from './style';
import addFonts from './fonts';
import { number, tabHandler } from './inputs';

export default function element(options) {
  this.id = options.id;
  this.channel = options.channel;

  this.channel.on('mount', params => {
    this.options = params.options;
    this.type = params.type;
    this.mount();
    this.applyStyle();
  });

  this.channel.on('focus', () => {
    this.element.focus();
  });

  this.mount = function() {
    this.createInput();
    this.channel.say('mounted', {
      size: {
        height: this.element.getBoundingClientRect().height,
        width: this.element.getBoundingClientRect().width,
      }
    });
  };

  this.createInput = function() {
    const inputs = {
      number: number,
      cvc: number,
      exp: number
    };

    this.element = new inputs[this.type]({ options: this.options, channel: this.channel }).element;
    
    // if Chrome / Safari when window receives 'focus'
    // it automatically set focus to the first focusable
    // element. While FireFox does not do this.
    // So, we add this tabHandler to set (forward) focus
    // to our element input (for Chrome, Safari).
    // For FireFox w
    document.body.append(tabHandler(() => {
      this.element.focus();
    }));

    document.body.append(tabHandler(() => {
      this.channel.say('forwardFocus', { direction: 'backward' });
    }));

    document.body.append(this.element);

    document.body.append(tabHandler((e) => {
      this.channel.say('forwardFocus', { direction: 'forward' });
    }));

    // This will set focus to element input. Chrome and Safari
    // will raise new focus event that will change focus to the
    // first focusable element in window. In order to handle this
    // we add one more tabHandler element as a first focusable element
    // so it will set focus as we expect. Read above.
    window.addEventListener('focus', (e) => {
      this.element.focus();
    });

    return this.element;
  };

  this.applyStyle = function() {
    this.element.classList.add("PowerInput");

    generateStyle(this.options.style);

    addFonts(this.options.fonts, () => {
      this.channel.say('resize', {
        size: {
          height: this.element.getBoundingClientRect().height,
          width: this.element.getBoundingClientRect().width,
        }
      });
    });
  };
}
