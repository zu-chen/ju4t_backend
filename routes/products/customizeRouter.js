const express = require("express");
const customizedRouter = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// multer is for the "/test-file-upload" route
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../ju4t_final_frontend/public/img/social/uploads/");
  },
  filename: function (req, file, cb) {
    // generate random file name
    let randomFileName = uuidv4();

    // first get the mimetype so we can convert it to an extension (e.g., .png, .jpg, .svg...)
    const mimetypeArr = file.mimetype.split("image/");
    let fileExtension = mimetypeArr[1];
    if (fileExtension === "svg+xml") {
      fileExtension = "svg";
    }
    cb(null, randomFileName + "." + fileExtension);
  },
});
const upload = multer({ storage: storage });

// save customized photo to file products upload photo
customizedRouter.post("/save-file", (req, res) => {
  // base64String sent from frontend (need to convert to image)
  const base64String = req.body.data;

  // Remove header
  let base64Image = base64String.split(";base64,").pop();

  // generate random file name
  let randomFileName = uuidv4();

  // save file to ju4t_final_frontend folder
  fs.writeFile(
    `../ju4t_final_frontend/public/img/products/uploads/${randomFileName}.png`,
    base64Image,
    { encoding: "base64" },
    function (err) {
      if (err) return console.log(err);
      console.log("file created");
    }
  );

  res.send(randomFileName);
});

// test file upload for FileUpload.js (frontend file located in src/test)
customizedRouter.post(
  "/test-file-upload",
  upload.single("photo"),
  (req, res) => {
    // send the filename (which includes the extension) back to frontend
    res.send(req.file.filename);
  }
);

module.exports = customizedRouter;
