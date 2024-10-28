import { Actions, SAVE_MAILSERVER } from "../actions/mailserver.action";
import {  mailserver,mailserverModel } from '../../store/model/mailserver.model';

export interface MailserverState {
  mailserverList: mailserverModel | null;
  }
  
export const initialMailserverState: MailserverState = {
  mailserverList: null
};

export function MailserverReducer(
  state = initialMailserverState.mailserverList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_MAILSERVER:
      return { ...state, mailserverList: action.payload};
    default:
      return state;
  }
}
