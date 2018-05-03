import Channel from '../utils/channel';
import Bus from '../utils/bus';

function Controller(options) {
  this.channel = new Channel({ label: 'inner_controller' })

  this.channel.on('tokenize', this._tokenize.bind(this));

  this.channel.connect({ target: window.parent });
  this.channel.childReady();
}

Controller.prototype._tokenize = function(framesIds) {
  console.log('inner controller tokenize for elements', framesIds);

  framesIds.forEach(function(frameId) {
    let target = window.parent.frames[frameId];
    console.log('send message to frame/target');

    this.channel.send('hi', { name: 'John' }, target).then(function(data) {
      console.log('hello', data[hello]);
    });
  }.bind(this));
};

new Controller('one');

const bus = new Bus();

bus.on('collect', function(data) {
  console.log('collect promise called', data);
});

bus.emit('collect', { data: 1 }, [window]);
bus.emit('collect', { data: 2 }, [window]);
bus.emit('collect', { data: 3 }, [window]);
