const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      Admin: Number,
      Editor: Number,
      User: {
        type: Number,
        default: 2001,
      },
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.password;
      },
    },
    timestamp: true,
  },
);

module.exports = mongoose.model('User', userSchema);
