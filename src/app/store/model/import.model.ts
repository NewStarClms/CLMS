export interface ImportModuleModel {
    importModuleID: number | 0,
    importModuleName: string | null,
    moduleOrder: number | 0,
    importModuleMasters: importModuleMasters[];
}

export interface importModuleMasters {
importID: number | 0,
importModuleID: number | 0,
importName: string | null,
description: string | null,
importNote: null,
maxRow: number | 0,
importType: string | null
}

export interface requestPayloadObject {
    moduleId: string | null,
    importId: string | null,
    importName:string | null,
    action:string | null,
    extraValue1:string | null 
}