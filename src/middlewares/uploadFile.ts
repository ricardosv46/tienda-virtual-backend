import { v2 as cloudinary } from 'cloudinary'
export const uploadFile = async (file: any) => {
  // The Upload scalar return a a promise
  const { createReadStream } = await file
  const fileStream = createReadStream()

  // Initiate Cloudinary with your credentials
  cloudinary.config({
    cloud_name: 'codigoconrich',
    api_key: '817637684672277',
    api_secret: 'bXdEB3G6Xux7TE28-JkwoLRlkgw'
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
