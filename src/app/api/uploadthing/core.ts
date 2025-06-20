import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@clerk/nextjs/server'

const uploadThing = createUploadthing()

export const ourFileRouter = {
  // define routes for different upload types
  imageUploader: uploadThing({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // runs on your server before upload
      const { userId } = await auth()

      if (!userId) throw new Error('Unauthorized')

      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        return { fileUrl: file.ufsUrl }
      } catch (error) {
        console.error('Error in onUploadComplete:', error)
        throw error
      }
    }),
} satisfies FileRouter
console.log('UPLOADTHING_TOKEN:', process.env.UPLOADTHING_TOKEN)

export type OurFileRouter = typeof ourFileRouter
