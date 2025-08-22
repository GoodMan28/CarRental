import multer, { diskStorage } from "multer";

const upload = multer({storage: multer.diskStorage({})});

export default upload;

// multer.diskStorage({}) is called with an empty object.

// Because no destination or filename functions are provided, Multer uses defaults:

// Destination → system’s temp directory (/tmp or equivalent on your OS).

// Filename → the original filename from the uploaded file.



// -------------------------------------------------------------------------------------------
// Code with the custimized destination and the filename
// Updated (custom config)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
// });

// const upload = multer({ storage });   // pass storage here

// export default upload;