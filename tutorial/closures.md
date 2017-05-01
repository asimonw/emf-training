## Scope and closures

Before we dive in, a few words on running node and variable hoisting.

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

Note that even the `if` clause is false, the variable `x` will get hoisted to the top, outside of the if block, exactly because blocks don't influence scope. (At least when using the `var` keyword to declare a variable. We'll talk about ES2015 later. Another important exception is catch blocks in try/catch statements.)

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
