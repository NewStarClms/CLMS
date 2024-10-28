import { Actions, SAVE_ORGANIZATION } from '../actions/master.action';
import {  Organization } from '../model/master-data.model';

export interface OrganizationState {
  organizationList: Organization | null;
  }
export const initialOrganizationState: OrganizationState = {
  organizationList: null
};

export function organizationReducer(
  state = initialOrganizationState.organizationList,
  action: Actions
) {
  switch (action.type) {
    case SAVE_ORGANIZATION:
      return { ...state, organizationList: action.payload};
    default:
      return state;
  }
}
