import cloudinary from "../config/cloudinary.config.js";

export const uploadImage = async (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'blog-app/posts',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            }
        ).end(buffer);
    });
};