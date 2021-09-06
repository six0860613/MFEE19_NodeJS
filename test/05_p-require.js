const Person = require('./04_person');

const p1 = new Person('Bill', 28);

console.log('JSON', p1.toJSON());
console.log('STR', p1.toString());