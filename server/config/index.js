import dotenv from 'dotenv'
dotenv.config();

const config = {
    db: {
      url: process.env.MONGO_URL
    }
  }
  
  export default config

  