# MediaShare - AWS Media Sharing Application

A modern web application for uploading and sharing photos and videos with secure storage on AWS S3 and metadata management in AWS RDS MySQL database.

## Features

- **Upload Media**: Upload photos and videos with drag-and-drop support
- **AWS S3 Storage**: Secure file storage in Amazon S3 buckets
- **RDS Metadata**: Store file metadata in AWS RDS MySQL database

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: AWS S3 (Simple Storage Service)
- **Database**: AWS RDS MySQL
- **Deployment**: Docker, ECR, EKS
- Infrastructure provisioning with **Terraform**

## Prerequisites

Before setting up the application, you'll need:

1. AWS Account with appropriate permissions
2. AWS S3 Bucket created
3. AWS RDS MySQL Database instance
4. Node.js 18+ and npm/yarn

## 📍 1. Infrastructure Setup (Terraform)

The infrastructure is provisioned using Terraform, including:

| Component | Description |
|----------|------------|
| VPC | Networking for AWS resources |
| RDS MySQL | Stores uploaded file metadata |
| S3 Bucket | Stores uploaded media files |
| ECR | Stores the Docker application image |
| EKS Cluster | Runs the application in Kubernetes |

## AWS Configuration Guide

### 1. AWS S3 Setup

#### Run Terraform
```
terraform init
terraform plan
terraform apply -auto-approve
```
Once deployed, note the outputs:
```
- RDS Endpoint
- S3 Bucket Name
- ECR Repo URL
```

### 3. Environment Variables Setup

Create or update `.env.local` with your AWS credentials and database connection:

env
```
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_S3_BUCKET_NAME=mediashare-uploads-prod

# AWS RDS MySQL Configuration
DATABASE_URL=mysql://admin:your_password@mediashare-db.xxxxx.us-east-1.rds.amazonaws.com:3306/mediashare
```
## Build and test the app locally
```
docker build -t mediashare-app .
docker run -p 3000:3000 --env-file .env mediashare-app
```

## Push Image to AWS ECR (CI/CD Automated)
The workflow uses GitHub Actions to:
- Build Docker image
- Authenticate to AWS ECR
- Push latest image automatically when pushing to the main branch

Workflow excerpt:
```
      - name: build image
        run: |
          IMAGE_URL="${{ env.AWS_ACCOUNT_ID}}.dkr.ecr.${{ env.AWS_REGION }}.amazonaws.com/${{ env.ECR_REPOSITORY }}:${{ github.sha }}"
          docker build -t $IMAGE_URL .
          echo "IMAGE_URL=$IMAGE_URL" >> $GITHUB_ENV

      - name: push to ECR
        run: |
          docker push ${{ env.IMAGE_URL}}
```

## Kubernetes Deployment (EKS)
After image push, Kubernetes manifests are applied.
Resources deployed:

| Object | Purpose |
|----------|------------|
| Deployment | Runs the application container |
| Service | Exposes the app internally |
| ConfigMap | App config (optional) |
| Secret | Database and AWS credentials |

```
kubectl apply -f deployment.yml
kubectl apply -f service.yml
kubectl apply -f configmap.yml
kubectl apply -f secret.yml
```

## Support and Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS RDS MySQL Documentation](https://docs.aws.amazon.com/rds/latest/UserGuide/CHAP_MySQL.html)
- [Next.js Documentation](https://nextjs.org/docs)

