const { createUploadthing } = require("uploadthing/express");

const f = createUploadthing();

/**
 * This is your UploadThing File Router.
 * You can define multiple "upload routes" for different parts of your app.
 */
const uploadRouter = {
  // Define a route for product images
  productImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // You can implement auth check here if needed
      // For now, we'll just return an empty metadata or dummy userId
      return { userId: "user_from_site" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after the upload is finished
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};

module.exports = { uploadRouter };
