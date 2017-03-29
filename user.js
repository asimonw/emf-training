var users = [
  {
    id: 1,
    name: 'Alex',
    email: 'alex@email.com'
  },
  {
    id: 2,
    name: 'Dan',
    email: 'dan@email.com'
  }
];

exports.find = function () {
  return users;
};
