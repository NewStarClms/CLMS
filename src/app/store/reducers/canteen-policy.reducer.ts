
import {Actions, SAVE_CanteenPolicyDetail } from '../actions/canteen-policy.action';
import { CanteenPolicyDetail } from '../model/canteen.model';


export interface CanteenPolicyDetailState {
    CanteenPolicyDetailList: CanteenPolicyDetail | null;
  }
  
  export const initialItemMasterState: CanteenPolicyDetailState = {
    CanteenPolicyDetailList: null
  };
  
  export function CanteenPolicyDetailReducer(
    state = initialItemMasterState.CanteenPolicyDetailList,
    action: Actions
  ) {
    switch (action.type) {
      case SAVE_CanteenPolicyDetail:
      return { ...state, CanteenPolicyDetailList: action.payload};
      default:
      return state;
    }
  }