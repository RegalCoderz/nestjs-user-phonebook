import { Injectable } from '@nestjs/common';
import { getStorage, ref, uploadBytes, UploadResult } from 'firebase/storage';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseStorageService extends FirebaseService {
  storage = getStorage();
  metadata = {
    contentType: 'image/jpeg',
  };

  constructor() {
    super();
    console.log('Parent Constructor has been called');
  }

  public uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    const storageRef = ref(this.storage, `avatars/${file.originalname}`);
    return uploadBytes(storageRef, file.buffer, this.metadata);
  }
}