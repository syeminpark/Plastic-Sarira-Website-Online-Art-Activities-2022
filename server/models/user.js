import mongoose from "mongoose";
import {
  v4 as uuidv4
} from "uuid";

export const USER_TYPES = {
  AUDIENCE: "audience",
  ADMINISTRATOR: "administrator",
};

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4().replace(/\-/g, ""),
  },
  name: String,
  type: {
    type: String,
    default: () => USER_TYPES.AUDIENCE
  }
}, {
  timestamps: false,
  collection: "users",
});


//static method
//this ensures performing operations on the userSchema object
userSchema.statics.createUser = async function (
  name,
  type
) {
  try {
    const user = await this.create({
      name,
      type
    });
    return user;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.getUserById = async function (id) {
  try {
    //mongoose's  findOne method to find an entry by id
    //id is unique= only one item
    const user = await this.findOne({ _id: id });
    if (!user) throw ({ error: 'No user with this id found' });
    return user;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.getAllUsers = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    throw error;
  }
}

userSchema.statics.deleteUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id });
    const result = await this.deleteOne({ _id: id });
   
    return user
  } catch (error) {
    throw error;
  }
}

userSchema.statics.deleteUsersByName = async function (_name) {
  try {
    const users = await this.find({ name: _name });
    const result = await this.remove({ name: _name });
   
    return {users , result}
  } catch (error) {
    throw error;
  }
}


export default mongoose.model("User", userSchema);