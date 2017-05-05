## Objects and prototypes

### Objects

We've already been using objects, but let's look into them a bit more systematically now. The simplest way to create an object is by using the literal syntax:
```javascript
var obj = {};
var user = {
  name: 'John',
  email: 'john@example.com'
};
```
This creates an empty object `obj` and an object `user` with properties `name` and `email`, respectively. Creating an empty object can also be done by invoking the `Object` function as a "constructor". (That's between quotes because, really, this only superficially mimics the way objects are created from classes in class-based object-oriented languages. JavaScript does not have classes; more on that later.) So, the first line above could have been written as:
```javascript
var obj = new Object();
```
And `user` could be created as follows:
```javascript
var user = new Object();
user.name = 'John';
user['email'] = 'john@example.com';
```
As you can see, properties can be added "dynamically" after the object has been created. And they can be accessed by either using the `.` operator (reminiscent of a lot of OOP languages) or by treating properties as keys in a hash table, using `[]`. Both approaches are equivalent when the key is a valid JavaScript identifier, but using `[]` is more flexible, allowing keys to be any string of characters, e.g. including spaces or dashes. For instance, `user['some weird-key']` would be totally valid. This also allows keys to be programmatically defined, which is often very useful:
```javascript
var country = 'UK';
var countryCode = countryCodeTable[country];
```
Note that any object created this way "inherits" functionality from the prototype of `Object`, such as a default `toString` method. How this works and how this relates to other ways to create objects using custom "constructor" functions or `Object.create` will be discussed below.

### `this` might be confusing

Before getting into prototypes and property delegation, it's useful to know how `this` works in JavaScript. The key thing to know about `this` binding is that it is not established when the function is defined, but through what is called its call-site when the function gets called.

There are essentially four distinct ways in which `this` can be bound to an object.

#### Default binding

If a function gets called without specifying a call-site, `this` defaults to the global object (`window` in the browser or `global` in Node) or `undefined` in strict mode. For instance, in Node:
```javascript
function foo() {
  console.log(this.a);
}
global.a = 0;
foo(); // 0
```
Notice that I set the property `a` on `global` explicitly, because just writing `var a = 41` doesn't actually create a global property, but a variable which is scoped to the CommonJS module. (Node essentially wraps the content of every file in a function call.)

#### Implicit binding

If we now use the exact same function, but call it "on an object" (a bit like a method call in some other languages), that object will become the call-site. That shows that `this` is indeed not determined by how the function is defined.
```javascript
var o1 = {
  a: 1,
  foo: foo
}
o1.foo(); // 1
```
Note that we need to add a property to `o1` which references the function `foo` in order to make this work. In this example, we say that `this` is implicitly bound to `o1` because of the way `foo` is called. To illustrate this point, this wouldn't have the same effect:
```javascript
var bar = o1.foo;
bar(); // 0
```
`bar` is a reference to the same function in memory as pointed to by the original `foo`. Since `bar` is not called with a specified call-site, it reverts to the default binding, the global object (or undefined). This is typically what leads to unexpected results in expressions like `setTimeout(o1.foo)`. Two ways around this are by either explicitly setting `this` in the calling function (similarly to how jQuery would bind `this` to the DOM element which triggered the event in an event handler) or by using the built in `bind` function which is defined on `Function.prototype`. For example, this would have the expected result:
```javascript
var bar = o1.foo.bind(o1);
bar(); // 1
```

#### Explicit binding

The downside of implicit binding is that the object used as call-site needs to have a property which references the function to be called. This is not always possible or desirable. In that case, you can explicitly bind `this` by using `Function.prototype.call` or `Function.prototype.apply`. Using the same function `foo` as above, we can do:
```javascript
var o2 = { a: 2 },
foo.call(o2); // 2
```
The first argument passed into `call` is then explicitly set to the `this` referenced inside of the function body of `foo`. Subsequent arguments would be simply passed into `foo`. That's where the difference with `apply` lies. To illustrate this, consider:
```javascript
function add(x, y) { return x + y; }
add.call(null, 3, 5); // 8
add.apply(null, [3, 5]); // 8
```
As you can see, `call` takes the arguments that need to get passed into `add` separately, while `apply` takes an array as second argument and "spreads" the elements of that array into the separate arguments to be passed into `add`. Of course, in this case, both expressions are simply equal to `add(3, 5)`. Note that, because `add` doesn't use `this`, the first argument, which would set the call-site, is irrelevant in this case. To make that explicit (and because we do need a first argument), we simply use `null`.

Using explicit binding, we can also illustrate how the built-in `bind`, referred to above, would work. A poor man's implementation would be:
```javascript
function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments);
  };
}
```
This is called a hard binding of `fn` to `obj` because every time the function resulting from `bind(fn, obj)` is called, it explicitly uses `apply` to set `obj` equal to `this`. This is also a nice use case for `apply`. The reserved keyword `arguments` gets set to an array-like object which contains all the arguments which are passed into the function when it's called. Because `bind` is a general utility function, we have no way of knowing how many arguments `var hardBoundFn = bind(fn, obj)` would take in general. That's when `arguments` and `apply` work well together to pass all the provided arguments into the function correctly.

It's important to note that explicit binding takes precedence over implicit binding. So, using `foo`, `o1` and `o2` from above:
```javascript
o1.foo.call(o2) // 2
```

#### `new` binding

The final context in which `this` shows up is when using "constructor" functions. When a function is called with the `new` operator, a new object is created and returned from that expression. For instance, let's say we want to create `User` objects. We would first define a function:
```javascript
function User(name, password) {
  this.name = name;
  this.password = password;
}
```
Note that this function does not explicitly return anything. If we were to call it in the usual way it would return undefined and `this` would be bound to the global object (or be undefined). When we call it with `new` however, something magical happens:
```javascript
var u1 = new User('Edward', 'c1ever');
u1.name = 'Edward';
```
When a function is called with new, essentially four things happen:
* a new object is created
* this object is bound to `this` inside of the function body
* the prototype of the newly created object is set (more on that very soon)
* the object is returned from the expression (unless the function explicitly returns something else)

That explains why `u1` ends up having a property called `name`. Note that once a function is called with `new`, there is no way to bind `this` differently with any of the above mechanisms.

### Prototypes

There is one 'magical' step in the "constructor pattern" above we haven't touched on yet, which relates to an object's prototype. To explain the concept of a prototype, ask yourself what happens when you call any object's `toString` method. Quite likely, you've defined the object without ever mentioning `toString`, so why doesn't the console yell "TypeError: undefined is not a function" at you when you do the following?
```javascript
var obj = { a: 42 };
obj.toString(); // [object Object]
```
The truth is that by default most objects have what is called a prototype link to `Object.prototype`. This happens because defining `var obj = {}` is equivalent to setting `var obj = new Object()`. This means that in the third step outlined above, `obj`'s prototype would be set to point to `Object.prototype`. In other words, even though the `toString` function doesn't actually exist on `obj`, when trying to access it, the JavaScript engine will go look if `obj` has a prototype to see if it exists there. Because in this case the prototype is `Object.prototype`, it will find a function at `Object.prototype.toString`.

How does this work in the previous example with the `User` function? It turns out that every function in JavaScript, even ones that will never be used as a "constructor" function, have a property called `prototype` which holds an empty object. In the case of `User`, we get an object called `User.prototype`. Initially, this object is not the prototype of anything yet (if the way things are named starts confusing you, just see it as a rite of passage to get through this). It's just "handily" named to remind us of the fact that it could end up being one. Note that `User.prototype` is **not** the prototype of `User`, but if you call `new User()` it will become the prototype of whatever object is created in the process.

Because one line of code sometimes speaks a thousand words, if we reconsider the code we wrote previously:
```javascript
function User(name, password) {
  this.name = name;
  this.password = password;
}
var u1 = new User('Edward', 'c1ever');
Object.getPrototypeOf(u1) === User.prototype; // true
```
You might have heard of `u1.__proto__` which would give you the same information as `Object.getPrototypeOf(u1)`, but `__proto__` is not standard. It was implemented by most browsers before `Object.getPrototypeOf` existed, but all modern browsers and versions of Node now have the latter, which is now the standard way of getting an object's prototype.

This is useful, because in this way functionality which is shared by all user objects can be stored on their common prototype.
```javascript
User.prototype.getName = function () {
  return this.name;
}
u1.getName(); // Edward
```
If we now define a second `User`, we don't have to define `getName` again.
```javascript
var u2 = new User('Julian', 'ingeni0us')
u2.getName(); // Julian
```
Another benefit is that the function definition only ends up being stored once in memory. Note how different bindings of `this` play a role here. When `u2` is defined `this` is bound to `u2` because of the `new` binding. Afterwards, when accessing `u2.getName`, `this` gets bound to `u2` again, but this time because `this` is set to the call-site implicitly. When defining `User.prototype.getName` there is no a priori way of knowing what `this` will be when it gets called; that's defined at call time.

How come, if now `User.prototype` is the prototype of `u1`, we can still access `u1.toString`. That's because `User.prototype` itself has `Object.prototype` is its prototype. If the JavaScript engine can't find a property on an object or its prototype, it will look for the latter's prototype and so on. It will traverse the "prototype chain" in this way until it reaches `Object.prototype` which has no further prototype.

This is reminiscent of the way inheritance works in classical OOP languages, but because the prototype mechanism is quite different, we tend to refer to delegation rather than inheritance. If a function exists on one of an object's prototypes, but not on the object itself, the object delegates that functionality down the prototype chain.

### More on delegation

Coming soon...

### Enumeration

Coming soon...
