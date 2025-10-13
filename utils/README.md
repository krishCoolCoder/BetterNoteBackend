# Utils - AWS S3 Upload Module

This folder contains utility functions for handling file uploads to AWS S3.

## Files

### 1. `s3Upload.js`
AWS S3 upload/delete utility with image validation.

**Functions:**
- `uploadToS3(file, folder)` - Upload file to S3 bucket
- `deleteFromS3(fileUrl)` - Delete file from S3 bucket
- `validateImageFile(file)` - Validate image file type and size
- `getPresignedUrl(fileUrl, expiresIn)` - Generate presigned URL for secure access

### 2. `multerConfig.js`
Multer middleware configuration for handling multipart/form-data file uploads.

**Configuration:**
- Storage: Memory storage (stores files in buffer)
- File size limit: 5MB
- Allowed file types: JPEG, JPG, PNG, GIF, WebP
- Max files per upload: 1

## Environment Variables Required

Add these to your `.env` file:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name
```

## Usage Examples

### Upload Image to S3

```javascript
const upload = require('./utils/multerConfig');
const { uploadToS3 } = require('./utils/s3Upload');

// In your route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = await uploadToS3(req.file, 'folder-name');
    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Generate Presigned URL

```javascript
const { getPresignedUrl } = require('./utils/s3Upload');

// In your route or controller
router.get('/image/:id', async (req, res) => {
  try {
    const s3Url = 'https://bucket.s3.amazonaws.com/folder/file.jpg';
    const presignedUrl = await getPresignedUrl(s3Url, 3600); // Expires in 1 hour
    res.json({ success: true, presignedUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## Features

✅ Automatic file validation (type and size)
✅ Unique filename generation with timestamp
✅ Public-read ACL for uploaded files
✅ Automatic cleanup of old images
✅ Detailed error handling and logging
✅ Memory-efficient buffer storage

## File Upload Validation

- **Allowed formats:** JPEG, JPG, PNG, GIF, WebP
- **Max file size:** 5MB
- **Files per upload:** 1

## S3 Bucket Configuration

Make sure your S3 bucket has:
1. Public read access enabled (or configure ACL accordingly)
2. CORS policy configured for your domain
3. Proper IAM permissions for the access keys

### Example CORS Policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### Example IAM Policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Error Handling

All functions throw descriptive errors that should be caught in your controller:

- `No file provided`
- `Invalid file type`
- `File size exceeds 5MB limit`
- AWS S3 specific errors (permission denied, bucket not found, etc.)

