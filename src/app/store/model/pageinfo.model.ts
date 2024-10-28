export interface PageInfo{
    pageNumber: number,
    pageSize: number,
    orderBy: string,
    orderDirection: string,
    searchKeyword: string,
  }

export interface PagedData{
    data: any[],
    totalRecords: number
  }