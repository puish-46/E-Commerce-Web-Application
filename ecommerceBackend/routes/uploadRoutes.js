import express from "express";

import upload
  from "../middleware/uploadMiddleware.js";

import {
  protect,
  admin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
============================
UPLOAD IMAGE
============================
*/

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),

  (req, res) => {
    res.status(200).json({
      imageUrl: req.file.path,
    });
  }
);

export default router;