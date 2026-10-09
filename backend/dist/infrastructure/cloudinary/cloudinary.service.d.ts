export declare class CloudinaryService {
    upload(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        publicId: string;
    }>;
    destroy(publicId: string): Promise<void>;
}
