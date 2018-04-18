export default function channel(options) {
  this.label = (options = (options || {})).label || 'parent';
  this.target = options.target;
  this.id = options.id;
  this.handlers = [];
  this.isReady = false;
  this.queue = [];

  this.connect = function(options) {
    this.target = options.target;
    this.id = options.id;

    return this;
  }

  this.send = function(type, payload) {
    var args;
    if (!this.isReady) {
      var args = Array.prototype.slice.call(arguments);
      this.queue.push(args);
    } else {
      this.target.postMessage({
        type: type,
        payload: payload,
        channel_id: this.id
      }, "*");
    }
  }

  this.replayQueue = function() {
    var self = this;

    this.queue.forEach(function(args) {
      self.send.apply(self, args);
    })

    this.queue = [];
  }

  this.receive = function(message) {
    var event;

    if (message.data.channel_id == this.id) {
      if (message.data.type == 'event') {
        event = message.data.payload;

        this.handleEvent(event.name, event.payload);
      }
    }
  }

  this.say = function(eventName, payload) {
    this.send('event', {
      name: eventName,
      payload: payload
    })
  }

  this.on = function(eventName, handler) {
    (this.handlers[eventName] || (this.handlers[eventName] = [])).push(handler);
  }

  this.handleEvent = function(eventName, payload) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((handler) => {
        try {
          handler(payload)
        } catch (e) {
        }
      });
    }
  }

  this.ready = function() {
    this.isReady = true;
    this.say('ready');
  }

  this.on('ready', () => {
    this.isReady = true;
    this.replayQueue();
  });

  window.addEventListener("message", this.receive.bind(this), false);
}
