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
  console.log('emit', event);

  targets.forEach(function(target) {
    target.postMessage({
      busEvent: event,
      payload: payload,
      callbackId: this._addCallback(callback)
    }, "*");
  }.bind(this));
};

Bus.prototype._addCallback = function(callback) {
  console.log('add callback');
  const callbackId = this.callbackId++;
  this.callbacks[callbackId] = callback;
  return callbackId;
};

Bus.prototype._receive = function(e) {
  console.log('_receive', e.data);
  const event = e.data.busEvent;
  const payload = e.data.payload;
  const callbackId = e.data.callbackId;
  const source = e.source;

  if (!event) return;

  if (event === 'callback') {
    console.log('call back', callbackId);
    this.callbacks[callbackId](payload);
    // this.callbacks.splice(callbackId, 1);
    return;
  }

  let callback;

  if (callbackId) {
    callback = function(data) {
      console.log('inside callback postMessage');
      source.postMessage({
        busEvent: 'callback',
        payload: data,
        callbackId: callbackId
      }, '*');
    };
  }

  console.log('process handlers');

  if (this.handlers[event]) {
    this.handlers[event].forEach((handler) => {
      try {
        handler(payload, callback);
      } catch (e) {
      }
    });
  }
};

// Bus.emit('collect', {}, frames).then(function(results) {
//   console.log(results);
// });

// Bus.on('collect').then(function(callback) {
//   console.log('got collect event');

//   callback({ data: (Math.random() * 1e5 | 0) });
// });

// Bus.prototype._addCallback = function(callback) {
//   if (!callback) return;

//   let id = ++this.callbackId;
//   this.callbacks[id] = callback;

//   return id;
// };

// const promise = new Promise(function(resolve, reject) {
//   const callback = function(data) {
//     resolve(data);
//   };

//   target.postMessage({
//     event: event,
//     payload: payload,
//     callback_id: this._addCallback(callback),
//     channel_id: this.id
//   }, "*");

// }.bind(this));

// return promise;
