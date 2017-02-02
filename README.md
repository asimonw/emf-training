## Quick JS facts

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

Note that even the `if` clause is false, the variable `x` will get hoisted to the top, outside of the if block, exactly because blocks don't influence scope. (At least when using the `var` keyword to declare a variable. We'll talk about ES2015 later.)

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

Coming soon...

### IIFEs

Coming soon...

### The module pattern

Coming soon...
