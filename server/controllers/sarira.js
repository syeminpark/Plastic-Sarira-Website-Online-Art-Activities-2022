import makeValidation from '@withvoid/make-validation';
// models
import SariraModel, { SARIRA_TYPES } from '../models/sarira.js';
import UserModel from '../models/user.js';
import url from "url"

export default {
    onPostSariraById: async (req, res) => { 

      try {
        //validation variable will return an object with 3 things
        //{success: boolean, message:string, errors:object}

        const validation = makeValidation(types => ({
          
          payload: req.body,
          checks: {
            type: { type: types.enum, options: { enum: SARIRA_TYPES }},
            message: { type: types.string },
          }
        }));
        if (!validation.success) return res.status(400).json(...validation);
  
        const user= await UserModel.getUserById(req.params.id) 
        if(!user){
          return res.status(400).json({
            success: false,
            message: "No User With This ID"
          });
        }
          const sariraData = await SariraModel.getSariraById(req.params.id)
          if(sariraData){
            return res.status(400).json({
              success: false,
              message: 'Sarira alreay exists',
            })
          }

        const userName= user.name
        //validation passes=
        const messagePayload = {
          name: userName,
          type: req.body.type,
          message: req.body.message,
        };
        const post = await SariraModel.postSariraById(req.params.id, messagePayload);
        
        return res.status(200).json({ success: true, post});
      } 
      catch (error) {
        return res.status(500).json({ success: false, error: error })
      }
      },
  

    onGetSariraById: async (req, res) => { 
      try {
        //get the roomID
        const sariraData = await SariraModel.getSariraById(req.params.id)
        //see if that room exists 
        if (!sariraData) {
          return res.status(400).json({
            success: false,
            message: 'No sarira exists for this id',
          })
        }

        return res.status(200).json({
          success: true,
          sariraData
        });
      } catch (error) {
        return res.status(500).json({ success: false, error });
      }
    },

    onGetAllSarira: async (req, res) => {
      try{
      const totalCount= await SariraModel.count()


      const pageLimit={
        page: parseInt(url.parse(req.url,true).query.page),
        limit: parseInt(url.parse(req.url,true).query.limit)
      };
      
     const allSariraData = await SariraModel.getAllSarira(pageLimit);

     if (!allSariraData){ 
       return res.status(400).json({
      success: false,
      message: 'There are no sariras',
    })
  }
   return res.status(200).json({
          success: true,
          allSariraData,
          totalCount: totalCount
        });
    }
    catch(error){
      return res.status(500).json({ success: false, error });
    }
  },

  onDeleteSariraById: async (req, res) => {
    try{
      const {sarira,result} = await SariraModel.deleteSariraById(req.params.id);
      if(!sarira){
        return res.status(400).json({error: "no Sarira Found"});
      }
      
      return res.status(200).json({
        success:true,
        message: `Deleted ${result.deletedCount} sarira`
      })
  }
  catch(error){
    return res.status(500).json({ success: false, error });
  }
  },


  onDeleteSarirasByName: async (req, res) => {
    try{
      const {sariras ,result} = await SariraModel.deleteSarirasByName(req.params.name);
      if(!sariras[0]){
        return res.status(400).json({error: "no Sarira Found"});
      }
      
      return res.status(200).json({
        success:true,
        message: `Deleted ${result.deletedCount} sarira`
      })
  }
  catch(error){
    return res.status(500).json({ success: false, error });
  }
  }
}

