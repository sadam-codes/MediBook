import { memoryStorage } from 'multer';

const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const multerConfig = {
    storage: memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req: unknown, file: { mimetype: string }, callback: (err: Error | null, accept: boolean) => void) => {
        if (!allowedMime.has(file.mimetype)) {
            return callback(new Error('Only JPEG, PNG, or WebP images are allowed.'), false);
        }
        callback(null, true);
    },
};
