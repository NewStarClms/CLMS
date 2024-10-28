import { HttpMethod, HttpMethods } from "../../common/constants/http-method.constants";

export class ServiceConfig {
    path: string;
    method: HttpMethods;
    requestHeader: {[name: string]: string | string[];
    }
    payloadObjects?: any;
    payloadSelectorKey?: string;
    storeAction?: string;

    constructor(){
        this.path = '';
        this.method = HttpMethod.GET;
        this.requestHeader = {};
        this.payloadObjects = null;
        this.payloadSelectorKey = '';
        this.storeAction = '';

    }
}
