import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "fr-par",
  endpoint: "https://s3.fr-par.scw.cloud",
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY!,
    secretAccessKey: process.env.SCW_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.SCW_BUCKET!;

export async function uploadToS3(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    })
  );

  return `https://${BUCKET}.s3.fr-par.scw.cloud/${params.key}`;
}
