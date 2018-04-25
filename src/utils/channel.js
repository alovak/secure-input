export default function Channel(options) {
  this.label = options.label;
  this.id = options.id || (Math.random() * 1e10 | 0);

  this.handlers = [];
  this.outgoingQueue = [];
  this.incomingQueue = [];
  this.isReady = false;
  this.isTargetReady = false;

  this.on('childReady', function(data) {
    this.id = data.channel_id;
    this.isTargetReady = true;
    this._processQueue(this.outgoingQueue);
  }.bind(this));

  window.addEventListener('message', this._receive.bind(this), false)
}

Channel.prototype.connect = function(options) {
  this.target = options.target;
};

Channel.prototype.ping = function() {
  this.on('ping', function() {
    console.log('pong', this.label, this.id);
  });

  window.setInterval(function() {
    this.say('ping');
  }.bind(this), 5000);
};

Channel.prototype.on = function(event, handler) {
  (this.handlers[event] || (this.handlers[event] = [])).push(handler.bind(this));
};

Channel.prototype.say = function(event, payload = {}) {
  this._send(event, payload);
};

Channel.prototype._receive = function(e) {

  const fn = function() {
    this._handleEvent(e);
  }.bind(this);

  this.incomingQueue.push(fn);

  if (this.isReady) {
    this._processQueue(this.incomingQueue);
  }
};

Channel.prototype._handleEvent = function(e) {
  const event = e.data.event;
  const payload = e.data.payload;

  if (e.source !== this.target) return;

  if (this.handlers[event]) {
    this.handlers[event].forEach((handler) => {
      try {
        handler(payload);
      } catch (e) {
      }
    });
  }
};

Channel.prototype._send = function(event, payload) {
  const fn = function() {
    this.target.postMessage({
      event: event,
      payload: payload,
      channel_id: this.id
    }, "*");
  }.bind(this);

  this.outgoingQueue.push(fn);

  if (this.target && this.isTargetReady) {
    this._processQueue(this.outgoingQueue);
  }
};

Channel.prototype._processQueue = function(queue) {
  while (queue.length > 0) {
    (queue.shift())();   
  }
};

Channel.prototype.parentReady = function() {
  this.isReady = true;
}

Channel.prototype.childReady = function() {
  this.isReady = true;
  this.isTargetReady = true;
  this.say('childReady', { channel_id: this.id });
}

// Channel.prototype.ready = function() {
//   this.isReady = true;
// };
