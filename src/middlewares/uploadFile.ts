import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
dotenv.config()

const CLOUD_NAME = process.env.CLOUD_NAME
const CLOUD_API_KEY = process.env.CLOUD_API_KEY
const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET

export const uploadFile = async (file: any) => {
  // The Upload scalar return a a promise
  const { createReadStream } = await file
  const fileStream = createReadStream()

  // Initiate Cloudinary with your credentials
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
  })

  // Return the Cloudinary object when it's all good
  return new Promise((resolve: any, reject: any) => {
    const cloudStream = cloudinary.uploader.upload_stream({ folder: 'graphql' }, function (err, fileUploaded) {
      // In case something hit the fan
      if (err) {
        reject(err)
      }

      // All good :smile:
      resolve(fileUploaded)
    })

    fileStream.pipe(cloudStream)
  })
}
