import { WorkflowRule } from '../model/workflow.model';
import { Actions, SAVE_WORKFLOW_RULE } from '../actions/workflow.action';

export interface WorkflowState {
  workflows: WorkflowRule | null;
  }
export const initialSectionState: WorkflowState = {
  workflows: null
};

export function WorkflowReducer(
  state = initialSectionState.workflows,
  action: Actions
) {
  switch (action.type) {
    case SAVE_WORKFLOW_RULE:
      return { ...state, workflows: action.payload};
    default:
      return state;
  }
}