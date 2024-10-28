import { Actions,  SAVE_COMPANY } from '../actions/master.action';
import {  Company } from '../model/master-data.model';

export interface CompanyState {
  companyList: Company | null;
  }
export const initialCompanyState: CompanyState = {
  companyList: null
};

export function companyReducer(
  state = initialCompanyState.companyList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_COMPANY:
      return { ...state, companyList: action.payload};
    default:
      return state;
  }
}
