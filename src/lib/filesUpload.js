import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
const BUCKET_NAME_FILES = process.env.BUCKET_NAME_FILES;
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

export const upload = file => {
    return new Promise((resolve, reject) => {
        let s3bucket = new aws.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
            Bucket: BUCKET_NAME_FILES
        });
        s3bucket.createBucket(
            {
                ACL: "public-read"
            },
            () => {
                let params = {
                    Bucket: BUCKET_NAME_FILES,
                    Key: file.filename,
                    Body: file.buffer
                };
                s3bucket.upload(params, (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            }
        );
    });
};
