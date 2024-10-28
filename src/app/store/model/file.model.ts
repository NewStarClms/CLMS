export interface FileUpload{
    fileName: string | null,
    fileDbName: string | null,
    fileVirtualPath: string | null,
    fileGuid: string,
    fileUrl:string |null
}
export interface FileDownload{
    fileByteArray: string | null,
    fileName: string | null
}

export interface FileVirtualPath{
  fileVirtualPath: string | null
}

