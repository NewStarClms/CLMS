import { Actions, SAVE_SMSSERVER } from "../actions/smsServer.action";
import { smsServer,smsServerModel } from "../../store/model/smsServer.model";


export interface SmsServerState {
    smsServerList: smsServerModel | null;
  }
export const initialMailserverState: SmsServerState = {
  smsServerList: null
};

export function SmsServerReducer(
  state = initialMailserverState.smsServerList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_SMSSERVER:
      return { ...state, smsServerList: action.payload};
    default:
      return state;
  }
}