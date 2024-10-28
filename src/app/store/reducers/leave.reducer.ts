import { Actions, GET_LEAVE_DATA, GET_LEAVE_POLICY_DATA, GET_LEAVE_MAPPED_DATA } from '../actions/master.action';
import { LeaveMasterList, LeaveModel, LeavePolicyDetail, leavePolicyMapping } from '../model/master-data.model';

export interface LeaveState {
  leaveList: LeaveModel | null;
  }
export const initialLeaveState: LeaveState = {
    leaveList: null
};

// Policy 
export interface LeavePolicyState {
  policies: LeavePolicyDetail | null;
  }
export const initialLeavePolicyState: LeavePolicyState = {
  policies: null
};

// Policy  Mapping
export interface LeavePolicyMapingState {
  mapping: leavePolicyMapping | null;
  }
export const initialLeavePolicyMapingState: LeavePolicyMapingState = {
  mapping: null
};

export function LeaveMasterReducer(
  state = initialLeaveState.leaveList,
  action: Actions
) {
  switch (action.type) {
    case GET_LEAVE_DATA:
      return { ...state, leavelList: action.payload};
    default:
      return state;
  }
}

export function LeavePolicyReducer(
  state = initialLeavePolicyState.policies,
  action: Actions
) {
  switch (action.type) {
    case GET_LEAVE_POLICY_DATA:
      return { ...state, policies: action.payload};
    default:
      return state;
  }
}

export function LeavePolicyMappingReducer(
  state = initialLeavePolicyState.policies,
  action: Actions
) {
  switch (action.type) {
    case GET_LEAVE_MAPPED_DATA:
      return { ...state, policies: action.payload};
    default:
      return state;
  }
}
