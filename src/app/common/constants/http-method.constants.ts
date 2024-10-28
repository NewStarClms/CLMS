export enum HttpMethod{
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    FILE='file',
    LOGIN='login'
}

export type HttpMethods = HttpMethod.GET | HttpMethod.POST | HttpMethod.PUT | HttpMethod.DELETE | HttpMethod.FILE ;
