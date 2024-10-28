import { SAVE_PAY_HEADS, SAVE_PAY_COMPONENTS, Actions } from '../actions/pay-component.action';
import { PayComponentModel, PayHeadsModel } from '../model/pay-component.model';

export interface PayHeadsState {
  payheadList: Array<PayHeadsModel> | null;
  }
export const initialheadState: PayHeadsState = {
    payheadList: null
};
export interface PayComponentState {
    payComList: Array<PayComponentModel> | null;
    }
  export const initialComponentState: PayComponentState = {
      payComList: null
  };

export function PayHeadReducer(
  state = initialheadState.payheadList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_PAY_HEADS:
      return { ...state, payheadList: action.payload};
    default:
      return state;
  }
}
export function PayComponentReducer(
    state = initialComponentState.payComList,
    action: Actions
  ) {
    switch (action.type) {
      case SAVE_PAY_COMPONENTS:
        return { ...state, payComList: action.payload};
      default:
        return state;
    }
  }