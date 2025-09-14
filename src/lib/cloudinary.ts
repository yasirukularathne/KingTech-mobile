import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadImage(buffer: Buffer, folder = "kingtech") {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", overwrite: true },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function destroyImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (e) {
    // ignore failures
  }
}

export function uploadRaw(
  buffer: Buffer,
  folder = "kingtech/files",
  filename?: string
) {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        overwrite: true,
        filename_override: filename,
        use_filename: Boolean(filename),
        unique_filename: !filename,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function destroyRaw(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch (_) {
    // ignore failures
  }
}
