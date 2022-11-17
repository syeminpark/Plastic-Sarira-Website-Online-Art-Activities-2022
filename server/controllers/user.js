import makeValidation from '@withvoid/make-validation';
// models
import UserModel, { USER_TYPES } from '../models/user.js';


export default {
    onCreateUser: async (req, res) => {

    //validate response
    try {
      //validation variable will return an object with 3 things
      //{success: boolean, message:string, errors:object}
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          name: { type: types.string },
          type: { type: types.enum, options: { enum: USER_TYPES }},
        }
      }));
      if (!validation.success) return res.status(400).json(...validation);
      //validation passes=
      const { name, type } = req.body;
      const user = await UserModel.createUser(name, type);
      return res.status(200).json({ success: true, user });
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
    },

    onGetUserById: async (req, res) => { 
      try {
        const user = await UserModel.getUserById(req.params.id);
        if(!user){
          return res.status(400).json({
            success: false,
            message: "No User With This ID"
          });
        }
        return res.status(200).json({ success: true, user });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },

    onGetAllUsers: async (req, res) => {
      try {
        const users = await UserModel.getAllUsers();
        if(users.length==0){
          return res.status(400).json({
            success: false,
            message: "No Users"
          });
        }
        return res.status(200).json({ success: true, users });
      } catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
    },
  
    onDeleteUserById: async (req, res) => {
      try {
        //req.params= has id, date.firstName,lastName,type,createdAt,updatedAt
        //these are values.
        const user = await UserModel.deleteUserById(req.params.id);
        if(!user){
          return res.status(400).json({error: "no User Found"});
        }
        
        return res.status(200).json({
          success: true, 
          message:  `Deleted ${user.name}`
        });
      } catch (error) {

        return res.status(500).json({ success: false, error: error })
      }
    },
    onDeleteUsersByName: async (req, res) => {
      console.log("hi")
      try {
        //req.params= has id, date.firstName,lastName,type,createdAt,updatedAt
        //these are values.

        const {users,result} = await UserModel.deleteUsersByName(req.params.name);
        if(!users[0]){
          return res.status(400).json({error: "no User Found"});
        }
        
        return res.status(200).json({
          success: true, 
          message:  `Deleted ${result.deletedCount} users`
        });
      } catch (error) {

        return res.status(500).json({ success: false, error: error })
      }
    },

  }