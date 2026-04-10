import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

/**
 * These components are generated once and used throughout your React app.
 * They connect to your backend's FileRouter.
 */
export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
