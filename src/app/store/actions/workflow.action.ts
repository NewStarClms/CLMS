import { Action } from '@ngrx/store';
import { WorkflowRule } from '../model/workflow.model';

export const SAVE_WORKFLOW_RULE = '[SL_UI] SAVE WORKFLOW RULE';

//start Report
export class SaveWorkflowRuleAction implements Action {
    readonly type = SAVE_WORKFLOW_RULE;
    constructor(public payload: WorkflowRule) { }
}

export type Actions = SaveWorkflowRuleAction 