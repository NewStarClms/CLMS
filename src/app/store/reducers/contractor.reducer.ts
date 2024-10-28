import { Actions, SAVE_CONTRACTOR } from '../actions/master.action';
import { Contractor } from '../model/master-data.model';

export interface ContractorState {
  contractorList: Contractor | null;
  }
export const initialContractorState: ContractorState = {
  contractorList: null
};

export function contractorReducer(
  state = initialContractorState.contractorList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_CONTRACTOR:
      return { ...state, contractorList: action.payload};
    default:
      return state;
  }
}
