const assert = require('assert');
const PowerPayments = require('../dist/power-payments.cjs');

console.log(PowerPayments().elements());
console.log(PowerPayments);

assert.equal(1,1);
