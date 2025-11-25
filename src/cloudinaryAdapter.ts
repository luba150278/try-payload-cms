// import { v2 as cloudinary } from 'cloudinary'
// import type { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
// import type { UploadApiResponse } from 'cloudinary'
// import sharp from 'sharp'

// // Налаштування Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// // Payload File з додатковими полями
// interface CloudinaryFile {
//   buffer: Buffer
//   filename: string
//   originalname?: string
//   mimeType?: string
//   filesize?: number
//   width?: number
//   height?: number
// }

// export const cloudinaryAdapter = () => ({
//   name: 'cloudinary-adapter',

//   async handleUpload({ file }: Parameters<HandleUpload>[0]) {
//     const f = file as CloudinaryFile

//     try {
//       // Отримуємо розміри зображення
//       try {
//         const metadata = await sharp(f.buffer).metadata()
//         f.width = metadata.width
//         f.height = metadata.height
//       } catch (err) {
//         console.warn('Could not get image dimensions', err)
//       }

//       // Завантажуємо в Cloudinary
//       const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             resource_type: 'auto',
//             public_id: `media/${f.filename.replace(/\.[^/.]+$/, '')}`,
//             overwrite: false,
//             use_filename: true,
//           },
//           (error, result) => {
//             if (error) return reject(error)
//             if (!result) return reject(new Error('No result from Cloudinary'))
//             resolve(result)
//           },
//         )
//         uploadStream.end(f.buffer)
//       })

//       f.filename = uploadResult.public_id
//       f.mimeType = `${uploadResult.format}`
//       f.filesize = uploadResult.bytes
//     } catch (err) {
//       console.error('Cloudinary Upload Error:', err)
//     }
//   },

//   async handleDelete({ filename }: Parameters<HandleDelete>[0]) {
//     try {
//       await cloudinary.uploader.destroy(`media/${filename.replace(/\.[^/.]+$/, '')}`)
//     } catch (err) {
//       console.error('Cloudinary Delete Error:', err)
//     }
//   },

//   staticHandler() {
//     return new Response('Not implemented', { status: 501 })
//   },
// })
import cloudinary from 'cloudinary'
import type { HandleUpload, HandleDelete } from '@payloadcms/plugin-cloud-storage/types'
import type { UploadApiResponse } from 'cloudinary'
import sharp from 'sharp'

// Використовуємо v2 Cloudinary
const v2 = cloudinary.v2

// Налаштування Cloudinary
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Payload File з додатковими полями
interface CloudinaryFile {
  buffer: Buffer
  filename: string
  originalname?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
}

export const cloudinaryAdapter = () => ({
  name: 'cloudinary-adapter',

  async handleUpload({ file }: Parameters<HandleUpload>[0]) {
    const f = file as CloudinaryFile

    try {
      // Отримуємо розміри зображення через sharp
      try {
        const metadata = await sharp(f.buffer).metadata()
        f.width = metadata.width
        f.height = metadata.height
      } catch (err) {
        console.warn('Could not get image dimensions', err)
      }

      // Завантажуємо в Cloudinary
      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = v2.uploader.upload_stream(
          {
            resource_type: 'auto',
            public_id: `media/${f.filename.replace(/\.[^/.]+$/, '')}`,
            overwrite: false,
            use_filename: true,
          },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error('No result from Cloudinary'))
            resolve(result)
          },
        )
        uploadStream.end(f.buffer)
      })

      f.filename = uploadResult.public_id
      f.mimeType = `${uploadResult.format}`
      f.filesize = uploadResult.bytes
    } catch (err) {
      console.error('Cloudinary Upload Error:', err)
    }
  },

  async handleDelete({ filename }: Parameters<HandleDelete>[0]) {
    try {
      await v2.uploader.destroy(`media/${filename.replace(/\.[^/.]+$/, '')}`)
    } catch (err) {
      console.error('Cloudinary Delete Error:', err)
    }
  },

  staticHandler() {
    return new Response('Not implemented', { status: 501 })
  },
})
