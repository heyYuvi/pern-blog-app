import multer from "multer";

const storage = multer.memoryStorage();


function fileFilter(req: any, file: any, cb:any) {
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    }else{
        cb(new Error("Only Image Is Allowed"), false);
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});