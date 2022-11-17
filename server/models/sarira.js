import mongoose from "mongoose";


export const SARIRA_TYPES = {
  AUDIENCE: "audience",
  ADMINISTRATOR: "administrator",
};

const sariraSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: String,
  type: {
    type: String,
    default: () => SARIRA_TYPES.AUDIENCE,
  },
  //dynamic object. whatever content i want 
  message: mongoose.Schema.Types.Mixed,

}, {
  timestamps: true,
  collection: "sariras",
});

sariraSchema.statics.postSariraById = async function (
  _id, {
    name,
    type,
    message
  }
) {
  try {


    const post = await this.create({
      _id,
      name,
      type,
      message
    });
    return post;
  } catch (error) {
    throw error;
  }
}

sariraSchema.statics.getSariraById = async function (id) {
  try {
    const sarira = await this.findOne({
      _id: id
    });
    return sarira
  } catch (error) {
    throw error;
  }

}

sariraSchema.statics.getAllSarira = async function (options) {
  try {
    return this.aggregate([
      //sort messages. get the newest at the top 
      {$sort: {
          createdAt: -1
        }
      },
      { $skip: options.page * options.limit },
      { $skip: options.page * options.limit },
      { $limit: options.limit },
        
    ]);
  } catch (error) {
    throw error;
  }
}

sariraSchema.statics.deleteSariraById = async function (id) {
  try {
    const sarira= await this.findOne({ _id: id });
    const result = await this.deleteOne({
      _id: id
    });
    return {sarira, result}
  } catch (error) {
    throw error;
  }
}

sariraSchema.statics.deleteSarirasByName = async function (_name) {
  try {
    const sariras= await this.find({name: _name });
    const result = await this.deleteMany({
      name: _name
    });
    return {sariras, result}
  } catch (error) {
    throw error;
  }
}


export default mongoose.model("Sarira", sariraSchema);