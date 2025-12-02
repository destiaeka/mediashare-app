# MediaShare - AWS Media Sharing Application

A modern web application for uploading and sharing photos and videos with secure storage on AWS S3 and metadata management in AWS RDS MySQL database.

## Features

- **Upload Media**: Upload photos and videos with drag-and-drop support
- **AWS S3 Storage**: Secure file storage in Amazon S3 buckets
- **RDS Metadata**: Store file metadata in AWS RDS MySQL database
- **Media Gallery**: View all uploaded media with thumbnails and details
- **File Management**: Delete media files with one click
- **Statistics**: Track total media count and storage usage

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: AWS S3 (Simple Storage Service)
- **Database**: AWS RDS MySQL
- **Deployment**: Vercel

## Prerequisites

Before setting up the application, you'll need:

1. AWS Account with appropriate permissions
2. AWS S3 Bucket created
3. AWS RDS MySQL Database instance
4. Vercel Account (for deployment)
5. Node.js 18+ and npm/yarn

## AWS Configuration Guide

### 1. AWS S3 Setup

#### Create S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Enter bucket name (e.g., `mediashare-uploads-prod`)
4. Choose region (e.g., `us-east-1`)
5. Uncheck "Block all public access" if you want public URLs
6. Click "Create bucket"

#### Configure CORS (Optional, for browser uploads)

1. Select your bucket
2. Go to "Permissions" → "CORS"
3. Add CORS configuration:

\`\`\`json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "MaxAgeSeconds": 3000
  }
]
\`\`\`

#### Create IAM User with S3 Access

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. Enter username (e.g., `mediashare-app`)
4. Click "Next"
5. Click "Attach policies directly"
6. Search for "AmazonS3FullAccess" and select it
7. Click "Create user"
8. In user details, go to "Security credentials" → "Create access key"
9. Choose "Application running on an AWS compute service" or "Other"
10. Copy the **Access Key ID** and **Secret Access Key**

### 2. AWS RDS MySQL Setup

#### Create RDS Database Instance

1. Go to [RDS Console](https://console.aws.amazon.com/rds/)
2. Click "Create database"
3. Select "MySQL"
4. Choose template: "Free tier" (recommended for testing)
5. DB instance identifier: `mediashare-db`
6. Master username: `admin`
7. Master password: Create a strong password
8. DB instance class: `db.t3.micro` (free tier)
9. Storage: 20 GB
10. Public accessibility: Yes (for development only)
11. Click "Create database"

#### Create Database Schema

Once your RDS instance is running:

1. Connect to your database using MySQL client:

\`\`\`bash
mysql -h <your-rds-endpoint> -u admin -p
\`\`\`

2. Run the schema from `scripts/schema.sql`:

\`\`\`sql
CREATE DATABASE IF NOT EXISTS mediashare;
USE mediashare;

-- Paste content from scripts/schema.sql here
\`\`\`

Or copy-paste the SQL commands from the `scripts/schema.sql` file.

#### Get Connection Details

1. In RDS Console, select your database
2. Copy the **Endpoint** (e.g., `mediashare-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. Note the **Port** (default: 3306)
4. Use your master username and password

### 3. Environment Variables Setup

Create or update `.env.local` with your AWS credentials and database connection:

\`\`\`env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_S3_BUCKET_NAME=mediashare-uploads-prod

# AWS RDS MySQL Configuration
DATABASE_URL=mysql://admin:your_password@mediashare-db.xxxxx.us-east-1.rds.amazonaws.com:3306/mediashare

# Development S3 Redirect (optional)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

## Local Development

### Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Upload

1. Click "Upload Files" or drag files
2. Select a photo or video
3. Wait for upload to complete
4. Verify file appears in gallery
5. Check AWS S3 console to see uploaded file
6. Check RDS database for metadata entry

## API Endpoints

### POST `/api/upload`

Upload a media file to S3 and store metadata in RDS.

**Request**:
- Form data with `file` field
- Supported types: images (jpg, png, gif, webp), videos (mp4, webm, mov)
- Max size: 100MB (configurable)

**Response**:
\`\`\`json
{
  "id": "uuid",
  "filename": "photo.jpg",
  "file_type": "image/jpeg",
  "file_size": 2048576,
  "s3_url": "https://bucket.s3.amazonaws.com/media/xxx.jpg",
  "uploaded_at": "2024-12-01T10:30:00Z"
}
\`\`\`

### GET `/api/media`

Fetch all uploaded media items from RDS database.

**Response**:
\`\`\`json
[
  {
    "id": "uuid",
    "filename": "photo.jpg",
    "file_type": "image/jpeg",
    "file_size": 2048576,
    "s3_url": "https://bucket.s3.amazonaws.com/media/xxx.jpg",
    "uploaded_at": "2024-12-01T10:30:00Z"
  }
]
\`\`\`

### DELETE `/api/media/[id]`

Delete media file from S3 and remove metadata from RDS.

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Media deleted successfully"
}
\`\`\`

## Deployment to Vercel

### 1. Push to GitHub

\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### 3. Add Environment Variables

In Vercel Project Settings → Environment Variables, add:

\`\`\`
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your-bucket-name
DATABASE_URL=mysql://admin:password@your-rds-endpoint:3306/mediashare
\`\`\`

### 4. Deploy

Click "Deploy" and wait for deployment to complete.

## Security Best Practices

1. **S3 Bucket Security**:
   - Enable versioning for disaster recovery
   - Enable S3 Block Public Access (unless you need public access)
   - Use S3 encryption (SSE-S3 or SSE-KMS)
   - Enable MFA Delete for critical buckets

2. **RDS Database Security**:
   - Use strong passwords (20+ characters, mixed case, numbers, symbols)
   - Enable automated backups (30-day retention)
   - Enable deletion protection
   - Use VPC security groups to restrict access
   - Enable encryption at rest and in transit

3. **Application Security**:
   - Rotate IAM access keys regularly
   - Use IAM roles instead of user credentials when possible
   - Validate file types on backend (not just extension)
   - Implement file size limits
   - Add rate limiting to API endpoints
   - Use HTTPS only in production
   - Implement authentication for file access

4. **Environment Variables**:
   - Never commit credentials to version control
   - Use Vercel's environment variables for production
   - Rotate access keys if compromised
   - Use different keys for development and production

## Monitoring and Logging

### CloudWatch Logs

Monitor API performance and errors:

1. Go to [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
2. Create log groups for your application
3. Set up alarms for errors and performance metrics

### S3 Access Logs

Enable S3 access logging:

1. S3 Console → Select bucket
2. Properties → Server access logging
3. Enable logging to another bucket

### RDS Performance Insights

Monitor database performance:

1. RDS Console → Select database
2. Performance Insights tab
3. View database load and slow queries

## Troubleshooting

### Upload Fails

- Check AWS credentials are correct
- Verify S3 bucket exists and is accessible
- Check file size limits
- Review CloudWatch logs

### Can't Access Database

- Verify RDS endpoint and port
- Check security group allows inbound on port 3306
- Confirm database and table exist
- Verify database user permissions

### Media Gallery Empty

- Check database connection string
- Verify media_files table exists
- Check RDS logs for query errors
- Ensure IAM user has read permissions

### S3 Files Not Accessible

- Check S3 bucket permissions
- Verify bucket policy allows access
- Check if objects are publicly readable
- Review S3 access logs

## Support and Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS RDS MySQL Documentation](https://docs.aws.amazon.com/rds/latest/UserGuide/CHAP_MySQL.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

## License

MIT License - feel free to use this project for personal or commercial use.
