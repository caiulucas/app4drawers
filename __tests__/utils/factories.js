const faker = require('faker');
const { factory } = require('factory-girl');
const { User, Drawing } = require('../../src/app/models');

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Drawing', Drawing, {
  drawing: 'drawing.jpg',
  description: faker.random.words(6),
});

module.exports = factory;
