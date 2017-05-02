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
`bar` is a reference to the same function in memory as pointed to by the original `foo`. Since `bar` is not called with a specified call-site, it reverts to the default binding, the global object (or undefined). This is typically what leads to unexpected results in expressions like `setTimeout(o1.foo)`. Two ways around this are by either explicitly setting `this` in the calling function (similarly to how jQuery would bind `this` to the DOM element which triggered the event in an event handler) or by using the built in `bind` function which is defined on `Function.prototype`.

### Prototypes

Coming soon...
