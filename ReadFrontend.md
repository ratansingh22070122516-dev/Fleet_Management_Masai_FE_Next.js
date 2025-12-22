Hosting the Frontend of Fleet Management System on AWS S3

This section explains how to host the Fleet Management System frontend on AWS S3 as a static website. It assumes the production build of the frontend is already generated.

Prerequisites

An active AWS account

AWS CLI installed and configured

Production build of the frontend (dist/ or build/)

Step 1: Create an S3 Bucket

Open AWS Console → S3

Click Create bucket

Enter a globally unique bucket name
Example: fleet-management-frontend

Select a suitable region

Uncheck Block all public access

Create the bucket

Step 2: Enable Static Website Hosting

Open the bucket → Properties

Enable Static website hosting

Set:

Index document: index.html

Error document: index.html

Save changes

Step 3: Upload Frontend Build Files

Upload all files from the frontend build directory (dist/ or build/) to the bucket.

Using AWS CLI (recommended):

aws s3 sync dist/ s3://fleet-management-frontend --delete

Step 4: Configure Bucket Policy

Add the following policy under Permissions → Bucket policy to allow public access:

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::fleet-management-frontend/*"
    }
  ]
}

Step 5: Access the Application

The application will be available at the Static website hosting endpoint shown in the bucket properties.