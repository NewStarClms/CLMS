import { Actions, SAVE_AUTO_CODE, SAVE_AUTO_CODE_ORG} from '../actions/core.action';
import {  AutoCode } from '../model/autocode.model';

export interface AutoCodeState {
  autocodeList: AutoCode | null;
}
export interface AutoCodeOrgState {
  orgList: Array<{key:string, value:string}> | null;
}
export const initialAutoCodeState: AutoCodeState = {
  autocodeList: null
};

export const initialAutoCodeOrgState: AutoCodeOrgState = {
  orgList: null
};

export function autocodeReducer(
  state = initialAutoCodeState.autocodeList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_AUTO_CODE:
      return { ...state, autocodeList: action.payload};
    default:
      return state;
  }
}

export function autocodeOrgReducer(
  state = initialAutoCodeOrgState.orgList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_AUTO_CODE_ORG:
      return { ...state, orgList:action.payload };
    default:
      return state;
  }
}
