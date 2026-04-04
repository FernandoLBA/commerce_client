export const allowedFileTypes = Object.freeze({
  IMAGE: "image/jpeg, image/png",
  FILE: ""
})

export type AllowedFilesType = keyof typeof allowedFileTypes;