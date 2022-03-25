const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validated(value) {
        if (value.includes("@") === false)
          throw new Error("Email isn't valid.");
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", UserSchema);
