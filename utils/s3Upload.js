const AWS = require('aws-sdk');
const path = require('path');

/**
 * S3 Upload Utility
 * Handles file uploads to AWS S3 bucket
 */

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Upload file to S3 bucket
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder path in S3 bucket (e.g., 'userProfiles')
 * @returns {Promise<string>} - Returns the S3 file URL
 */
const uploadToS3 = async (file, folder = 'userProfiles') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}${fileExtension}`;

    // S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    //   ACL: 'public-read' // Make the file publicly accessible
    };

    // Upload to S3
    console.log('📤 Uploading file to S3:', fileName);
    const result = await s3.upload(params).promise();
    
    console.log('✅ File uploaded successfully:', result.Location);
    return result.Location; // Return the file URL

  } catch (error) {
    console.error('❌ Error uploading to S3:', error);
    throw error;
  }
};

/**
 * Delete file from S3 bucket
 * @param {string} fileUrl - Full S3 file URL
 * @returns {Promise<void>}
 */
const deleteFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    // Extract the key from the full URL
    const urlParts = new URL(fileUrl);
    const key = urlParts.pathname.substring(1); // Remove leading '/'

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key
    };

    console.log('🗑️  Deleting file from S3:', key);
    await s3.deleteObject(params).promise();
    console.log('✅ File deleted successfully');

  } catch (error) {
    console.error('❌ Error deleting from S3:', error);
    throw error;
  }
};

/**
 * Validate image file
 * @param {Object} file - Multer file object
 * @returns {boolean}
 */
const validateImageFile = (file) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    throw new Error('No file provided');
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit');
  }

  return true;
};

/**
 * Generate presigned URL for S3 object
 * @param {string} fileUrl - Full S3 file URL or key
 * @param {number} expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns {Promise<string>} - Returns presigned URL
 */
const getPresignedUrl = async (fileUrl, expiresIn = 3600) => {
  try {
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    let key;
    
    // Check if it's a full URL or just a key
    if (fileUrl.startsWith('http')) {
      // Extract the key from the full URL
      const urlParts = new URL(fileUrl);
      key = urlParts.pathname.substring(1); // Remove leading '/'
    } else {
      // It's already a key
      key = fileUrl;
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Expires: expiresIn // Time in seconds until the URL expires
    };

    console.log('🔗 Generating presigned URL for:', key);
    const presignedUrl = await s3.getSignedUrlPromise('getObject', params);
    console.log('✅ Presigned URL generated successfully');
    
    return presignedUrl;

  } catch (error) {
    console.error('❌ Error generating presigned URL:', error);
    throw error;
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  validateImageFile,
  getPresignedUrl,
  s3
};

