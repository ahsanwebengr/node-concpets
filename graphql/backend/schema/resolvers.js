const User = require('../models/User');

module.exports = {
  user: async ({ id }) => User.findById(id),
  users: async () => User.find(),

  addUser: async ({ name, email, age }) => {
    const user = new User({ name, email, age });
    return user.save();
  },

  updateUser: async ({ id, name, email, age }) => {
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (age !== undefined) updateFields.age = age;

    return User.findByIdAndUpdate(id, updateFields, { new: true });
  },

  deleteUser: async ({ id }) => User.findByIdAndDelete(id),
};
