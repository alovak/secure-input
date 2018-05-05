import Config from '../config';

export default function Bus() {
  this.handlers = [];
  this.callbacks = {};
  this.callbackId = 1;

  window.addEventListener('message', this._receive.bind(this), false);
}

Bus.prototype.on = function(event, handler) {
  (this.handlers[event] || (this.handlers[event] = [])).push(handler.bind(this));
};

Bus.prototype.emit = function(event, payload, targets, callback) {
  const promises = [];

  targets.forEach(function(target) {
    const promise = new Promise(function(resolve, reject) {
      target.postMessage({
        busEvent: event,
        payload: payload,
        callbackId: this._addCallback(callback || resolve)
      }, Config.baseUrl);
    }.bind(this));

    promises.push(promise);

  }.bind(this));

  return Promise.all(promises);
};

Bus.prototype._addCallback = function(callback) {
  const callbackId = this.callbackId++;
  this.callbacks[callbackId] = callback;
  return callbackId;
};

Bus.prototype._receive = function(e) {
  const event = e.data.busEvent;
  const payload = e.data.payload;
  const callbackId = e.data.callbackId;
  const source = e.source;

  if (e.origin !== Config.baseUrl || !event) return;

  if (event === 'callback') {
    this.callbacks[callbackId](payload);
    delete this.callbacks[callbackId];
    return;
  }

  let callback;

  if (callbackId) {
    callback = function(data) {
      source.postMessage({
        busEvent: 'callback',
        payload: data,
        callbackId: callbackId
      }, '*');
    };
  }

  if (this.handlers[event]) {
    this.handlers[event].forEach((handler) => {
      try {
        handler(payload, callback);
      } catch (e) {
      }
    });
  }
};
