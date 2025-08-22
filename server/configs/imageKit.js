import ImageKit from "imagekit";

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey :  process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_END_POINT
});

export default imagekit; 

// You can use this Node.js SDK for three different methods - URL generation, file upload, and media management operations. The usage of the SDK has been explained below.
// URL Generation
// File Upload
// File Management

// ------------------------------------------------------------------------------------------------
// So in short:
// With path → you say: “Here’s the path, please build the full link for me.”
// With src → you say: “Here’s the full link, just add resize/transform instructions.”