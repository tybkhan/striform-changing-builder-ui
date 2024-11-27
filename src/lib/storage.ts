import { supabase } from './supabase'

const createBucketIfNotExists = async (bucketName: string) => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)

    if (!bucketExists) {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/*', 'application/pdf']
      })

      if (error) throw error
      console.log('Bucket created successfully:', bucketName)
    }
  } catch (error) {
    console.error('Error checking/creating bucket:', error)
  }
}

export const uploadFile = async (file: File, bucket: string = 'form-uploads') => {
  try {
    // Ensure bucket exists
    await createBucketIfNotExists(bucket)

    // Check file size (10MB limit by default)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`)
    }

    // Create a unique file path
    const timestamp = new Date().getTime()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${timestamp}-${sanitizedFileName}`

    console.log('Attempting to upload file:', {
      bucket,
      filePath,
      fileSize: file.size,
      fileType: file.type
    })

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (error) {
      console.error('Supabase storage upload error:', error)
      throw error
    }

    if (!data?.path) {
      throw new Error('Upload successful but file path is missing')
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    console.log('File uploaded successfully:', {
      path: data.path,
      publicUrl
    })

    return {
      path: data.path,
      url: publicUrl,
      name: file.name,
      size: file.size,
      type: file.type
    }
  } catch (error: any) {
    console.error('Detailed upload error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    // Provide more user-friendly error messages
    if (error.message.includes('storage/bucket-not-found')) {
      throw new Error('Storage bucket not configured properly')
    } else if (error.message.includes('JWT')) {
      throw new Error('Authentication error - please try logging in again')
    } else if (error.statusCode === 400) {
      throw new Error('Invalid file or upload configuration')
    } else if (error.statusCode === 403) {
      throw new Error('Permission denied - please check storage bucket policies')
    }
    
    throw error
  }
}

export const deleteFile = async (filePath: string, bucket: string = 'form-uploads') => {
  try {
    console.log('Attempting to delete file:', {
      bucket,
      filePath
    })

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('File deletion error:', error)
      throw error
    }

    console.log('File deleted successfully:', filePath)
  } catch (error: any) {
    console.error('Detailed deletion error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    throw error
  }
}

export const getFileUrl = (filePath: string, bucket: string = 'form-uploads') => {
  if (!filePath) {
    throw new Error('File path is required')
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}