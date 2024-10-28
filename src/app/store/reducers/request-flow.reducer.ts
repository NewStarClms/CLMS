import { RequestFlowModel, RequestApproveModel } from '../model/request.model';
import { SAVE_REQUEST_FLOW, Actions, SAVE_REQUEST_FLOW_APPROVE } from '../actions/request-flow.action';

export interface RequestState {
  RequestList: RequestFlowModel | null;
  }
export const initialSectionState: RequestState = {
    RequestList: null
};
export interface RequestAppState {
  RequestAppList: RequestApproveModel | null;
  }
export const initialRequestState: RequestAppState = {
  RequestAppList: null
};
export function RequestReducer(
  state = initialSectionState.RequestList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_REQUEST_FLOW:
      return { ...state, RequestList: action.payload};
    default:
      return state;
  }
}
export function RequestApproveReducer(
  state = initialRequestState.RequestAppList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_REQUEST_FLOW_APPROVE:
      return { ...state, RequestAppList: action.payload};
    default:
      return state;
  }
}