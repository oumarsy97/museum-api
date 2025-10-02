// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudnaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Upload image (existant)
  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'oeuvres/images',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  // Upload vidéo et audio
  async uploadVideo(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'oeuvres/medias',
          resource_type: 'video', // Cloudinary utilise 'video' pour vidéo ET audio
          chunk_size: 6000000, // 6MB chunks pour les gros fichiers
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }

  // Méthode générique qui détecte automatiquement le type
  async uploadFile(file: Express.Multer.File): Promise<any> {
    const mimetype = file.mimetype;
    
    if (mimetype.startsWith('video/') || mimetype.startsWith('audio/')) {
      return this.uploadVideo(file);
    } else {
      return this.uploadImage(file);
    }
  }

  // Supprimer un fichier de Cloudinary
  async deleteFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }
}