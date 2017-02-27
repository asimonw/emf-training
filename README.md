## Quick JS tutorial

### Running node

There are two basic ways to run node. Type `node` on the command line without arguments to start a **REPL** (read-eval-print-loop) or run `node <filename>` to run the code in a file.

### Variable hoisting

A variable declaration like `var a` gets moved or _hoisted_ to the top of the current scope. For instance, the following will print out `undefined`.

```javascript
console.log(a);
var a = 10;
```

This is because in a first run through the code, the compiler will turn this into essentially

```javascript
var a;
console.log(a);
a = 10;
```

**Function statements** also get hoisted, and even their full definition will be available from the top of their enclosing scope. For instance, the following will print out `hoisted!`, even though the function is defined after it's being used:

```javascript
saySomething('hoisted!');

function saySomething(message) {
  console.log(message);
}
```

Note that this doesn't quite work the same way when defining a function by assigning a **function expression** to a variable. In that case, like with any other variable (functions are first-class citizens in JavaScript, essentially a special kind of object), only the variable declaration will get hoisted, not the value assigned to it, even if that value is a function. For example, this will throw a `TypeError` because `undefined is not a function`:

```javascript
saySomething('hoisted!'); // TypeError!

var saySomething = function (message) {
  console.log(message);
}
```
### Scope

Variables are function scoped, not block scoped. For instance, this will log `7` to the console:

```javascript
if (true) {
  var x = 7;
}
console.log(x);
```

Note that even the `if` clause is false, the variable `x` will get hoisted to the top, outside of the if block, exactly because blocks don't influence scope. (At least when using the `var` keyword to declare a variable. We'll talk about ES2015 later. Another important exception is try/catch blocks.)

This example illustrates the basics of function scoping:

```javascript
var x = 3;
function hideApples() {
  var x = 7;
  var apples = 5;
  console.log(x); // 7 (shadows global x)
  console.log(apples); // 5
}
hideApples();
console.log(x); // 3 (global x again)
console.log(apples) // ReferenceError (apples cannot be accessed in global scope)
```

This means that functions are a perfect **encapsulation** or **information hiding** mechanism.

### Closures

An important concept in Functional Programming is that of a closure. The simplest example is a (higher-order) function `f1` which returns another function `f2`. Any variables in the scope of `f1` can be accessed by `f2` even after `f1` has been called and its execution context has been removed from the stack. The variables in the scope of `f1` are not removed from memory because there is still a reference to them from within `f2` (assuming that we assigned `f2` to a variable so that there is still a reference to `f2` in our program). We say that `f2` closes over these variables, keeping them "alive".

Let's look at a simple counter function to clarify this:

```javascript
function makeCounter(n) {
  n = n || 0;

  return function () {
    return n++;
  }
}
```

Calling this "factory function" returns a counter function for us:

```javascript
var countFromZero = makeCounter();
console.log(countFromZero()); // 0
console.log(countFromZero()); // 1
```
Note that even though `makeCounter` has already returned on line 1, the reference to the returned function `countFromZero` still has a reference to the variable `n`, incrementing it by 1 every time the function gets called.

It's important to understand that every time `makeCounter` is called it creates and returns a new function _and_ a its own copy of the variable `n`. For example, let's say that we call `makeCounter` again in the same program:

```javascript
var countFromTen = makeCounter(10);
console.log(countFromTen()); // 10
console.log(countFromTen()); // 11
console.log(countFromZero()); // 2
```

Note that calling `countFromZero` again after having called `countFromTen` a few times returns `2`, because every "instance" of the counter function has it's own local variable.

This approach shares a lot of the benefits of class-based Object-Oriented Programming (we'll talk about JavaScript's approach to OOP, which is prototype based, later), like encapsulation and a notion of "instance variables". Let's take this analogy a step further and show how easily you can mimic classes by using closures.

Define a `Person` "constructor" function as follows:
```javascript
var Person = function (name, age) {
  // interface
  return {
    getName: getName,
    getAge: getAge,
    setName: setName
  }

  // implementation details
  function getName() {
    return name + '!';
  }

  function getAge() {
    return age;
  }

  function setName(n) {
    if (n.length > 0) name = n;
  }
};
```

This `Person` function returns an object which provides an interface for manipulating _person objects_. These "instances" of the `Person` "class" have a few "private properties" `name` and `age`. These cannot be accessed directly, but only through getters and setters, if we choose to define those. Notice that this allows us to validate the `name` to set in `setName`, for instance. In this case, we also didn't allow the `age` variable to be updated at all, making it _read only_.

This is how you'd use the `Person` function (notice how much this feels like classical OOP):
```javascript
var bob = Person('Bob', 33);
console.log(bob.getName(), bob.getAge()); // Bob! 33

bob.setName('Robert');
console.log(bob.getName(), bob.getAge()); // Robert! 33
```

It's unclear how to implement a notion of inheritance using this pattern (although composition is naturally incorporated), but we'll get to that when we talk about `prototypes`.

### IIFEs

Because blocks don't generally limit scope in JavaScript, a widely used pattern (especially pre-ES2015 and CommonJS) is to use an immediately invoked function expression (or IIFE) to achieve the same goal.

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

Coming soon...
