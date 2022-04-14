require("dotenv").config();
import { S3 } from "aws-sdk";
import { readFileSync } from "fs";

const s3Upload = async (filename) => {
  try {
    const fileContent = readFileSync(filename);
    console.log(fileContent);
    const s3 = new S3({
      accessKeyId: process.env.AWS_CLIENT_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    console.log(process.env.AWS_CLIENT_ID, process.env.AWS_SECRET_KEY);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "upload.png",
      Body: fileContent,
      ACL: "public-read",
      ContentType: "image/png",
    };

    const data = await s3.putObject(params).promise();
    return data;
  } catch (error) {
    return error.message;
  }
};

export default s3Upload;
