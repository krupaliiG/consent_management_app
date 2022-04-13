const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const newPassword = await bcrypt.hash(password, 10);
  return newPassword;
};

export default hashPassword;
