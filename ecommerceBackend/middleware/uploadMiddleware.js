import multer from "multer";

import {
  CloudinaryStorage,
} from "multer-storage-cloudinary";

import cloudinary
  from "../config/cloudinary.js";

/*
============================
STORAGE
============================
*/

const storage =
  new CloudinaryStorage({
    cloudinary,

    params: {
      folder:
        "ecommerce-products",

      allowed_formats: [
        "jpg",
        "png",
        "jpeg",
      ],
    },
  });

/*
============================
UPLOAD
============================
*/

const upload =
  multer({
    storage,
  });

export default upload;