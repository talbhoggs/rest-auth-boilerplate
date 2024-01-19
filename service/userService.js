const Users = {
    users: require('../model/users.json'),
    setUsers: function (users) {
        this.users = users;
    },
};

module.exports = {...Users};
