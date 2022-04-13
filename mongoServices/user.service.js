import { userModel } from "../models";

const findOneQuery = async (email) => {
  const data = await userModel.find({ email: email });
  return data;
};

const insertOne = async (body) => {
  const data = new userModel(body);

  await data.save();
};

export default {
  findOneQuery,
  insertOne,
};
