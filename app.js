var Event = (function () {
  var handlers = {};

  function onEvent(name, fn) {
    if (!(name in handlers)) {
      handlers[name] = [];
    }
    handlers[name].push(fn);
  }

  function onTrigger(name) {
    if (name in handlers) {
      // for (var i = 0; i < handlers[name].length; i++) {
      //   handlers[name][i]();
      // }
      handlers[name].forEach(function (handler) {
        if (typeof handler === 'function') {
          handler();
        }
      });
    }
  }

  // interface
  return {
    on: onEvent,
    trigger: onTrigger
  };
})();

function clickHandler() {
  console.log('clicked!');
}

Event.on('click', clickHandler);
Event.on('scroll', function () { console.log('scrolled!'); });
Event.on('scroll', function () { console.log('scrolled again!'); });

Event.trigger('click');
Event.trigger('scroll');
