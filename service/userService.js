const Users = {
  users: require('../model/users.json'),
  setUsers(users) {
    this.users = users;
  },
};

module.exports = { ...Users };
