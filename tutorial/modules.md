## Modules before ES2015

### IIFEs

Because blocks don't generally limit scope in JavaScript, a widely used pattern (especially before ES2015 and CommonJS) is to use an immediately invoked function expression (or IIFE) to achieve the same goal.

Imagine that you'd define a function and all you'd with it is immediately call it:
```javascript
function callMe(moreApples) {
  console.log(moreApples);
}
callMe(9) // 9
console.log(moreApples) // ReferenceError
```
Because `moreApples` is wrapped in a function, it's safely hidden from the outer scope, but since we'll never call that function again, why not define the function as a function expression and invoke (i.e. call) it immediately:

```javascript
(function callMe(moreApples) {
  console.log(moreApples);
})(9); // 9
console.log(moreApples) // ReferenceError
```

Take some time let this sink in... This statement has the general form `(<function expression>)();`. The parenthesis around the function expression are necessary because otherwise the compiler would think that we're dealing with a function statement. A function statement can't be called immediately though. The reason is that a function expression actually _returns_ a function (which can then either be assigned to a variable, registered as a callback or invoked immediately). So the above statement simply evaluates to `<function object>();`. As you can see in the example, since 'callMe' takes one parameter, the function expression needs to be called with an argument, in this case `9`. Also note that there is no need to name the function, so we could have just used an anonymous function. Naming function expressions does make it easier to track down bugs during debugging, as the dev tools can then give you the name of the function instead of the always helpful `<anonymous function>`.

So, to summarise, the IIFE takes the general form:

```javascript
(function functionName(/* parameters */) {
  /* ... */
})(/* arguments */);
```

Beautiful. The ability to pass in arguments comes in handy when you want to use a shortcut for a library namespace (such as `$` for jQuery), but there is a chance that other libraries use the same namespace (by namespace, I mean the module object exposed by the library, see below). In the case of jQuery you could do:
```javascript
jQuery.noConflict(); // don't alias jQuery with $
(function ($) {
  /* use $ as you're used to */
})(jQuery);
```

### The module pattern

The above ideas can be combined into what is called the module pattern. As an example, let's say we'd like to implement a simple event emitter module. All a user of our module needs to know is how to trigger an event, and how to listen for emitted events and associate handlers to them. The data structure used to map events to event handlers and how it's updated and accessed, are implementation details which shouldn't concern the user and are actually better kept private.

```javascript
var Event = (function () {
  var handlers = {}; // private "property" to manage handlers

  function onEvent(name, fn) {
    if (!(name in handlers)) {
      handlers[name] = [fn];
    } else {
      handlers[name].push(fn);
    }
  }

  function onTrigger(name) {
    if (name in handlers) {
      handlers[name].forEach(function (handler) { handler(); });
    }
  }

  // interface
  return {
    on: onEvent,
    trigger: onTrigger
  };
})();
```

This is called the revealing module pattern (there are other variations on the module pattern out there) because the interface is explicitly returned from the IIFE as an object with the necessary methods as properties. This means that the `Event` variable now points to an object and effectively acts as a namespace for the functionality exposed by the module. Here's how you'd use it:

```javascript
Event.on('click', function () { console.log('clicked!') });
Event.on('click', function () { console.log('clicked again!') });
Event.on('scroll', function () { console.log('scrolled!') });

Event.trigger('click');
Event.trigger('scroll');
```

Note that this is not a full-blown implementation of an event system (no way to cancel events, trigger events only once, etc), but it gives you an idea. What's important here is that the `handlers` object cannot be accessed outside of the module block. It's up to the implementer of the event emitter to deal with the implementation details, not the user of the interface. This allows implementation details to change without impacting the users as long as the API (function methods, parameter lists, return values, semantics) doesn't change.

### CommonJS modules

These days, rather than using the above patterns to create modules, people often use the CommonJS specification (we'll talk about ES2015 modules later). This is the way Node.js deals with modules and it can also be used to organise client-side JavaScript by using bundlers such as Browserify.

As a very simple (and overly simplistic) example, let's say that we have an app which uses two modules, one which provides a user object and one which provides a "view" function to log the user to the console. (In a more realistic example, this could be a user model which pulls data from a database and a rendering function which displays the user data in the browser.)

The app would `require` the functionality provided by the modules as follows:
```javascript
// app.js

var user = require('./user');
var view = require('.view');

view(user);
```
This assumes that there are two files `user.js` and `view.js` in the same folder as `app.js`. (Node.js knows to look for `.js` files, so writing the extension is optional.) The respective files would then use `module.exports` to "export" an object or function to be used in other modules. For example, this is how `user.js` exports an object:
```javascript
// user.js

module.exports = {
  name: 'John',
  email: 'john@example.com'
};
```
Of course, often a lot more would be going on in a module, but `module.exports` gathers all the data and methods which will be accessible to other modules `require`ing the given module. In a similar fashion, `view.js` exports a function to be used in `app.js`:
```javascript
// view.js

module.exports = function (user) {
  console.log('Name: ' + user.name + ', Email: ' + user.email);
};
```
There's another way to export things from a CommonJS module, but this is the most euhm... common way, so we'll stick to this for now.
