export const workflowReadinessStates = {
  pendingValidation: "pending-validation",
  ready: "ready",
} as const;

export type WorkflowReadinessState =
  (typeof workflowReadinessStates)[keyof typeof workflowReadinessStates];

export const workflowReadiness = {
  buyerTransaction: {
    gate: "BUYER_WORKFLOW_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    state: workflowReadinessStates.pendingValidation,
  },
  agentStart: {
    gate: "AGENT_START_WORKFLOW_REQUIRED_BEFORE_PUBLICATION",
    state: workflowReadinessStates.pendingValidation,
  },
  agreementPaymentRoles: {
    gate: "AGREEMENT_PAYMENT_ROLE_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    state: workflowReadinessStates.pendingValidation,
  },
  reportPermissions: {
    gate: "REPORT_PERMISSION_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    state: workflowReadinessStates.pendingValidation,
  },
  newConstructionInterest: {
    gate: "NEW_CONSTRUCTION_INTEREST_WORKFLOW_REQUIRED_BEFORE_PUBLICATION",
    state: workflowReadinessStates.pendingValidation,
  },
  contactFormDelivery: {
    gate: "CONTACT_FORM_DELIVERY_REQUIRED_BEFORE_PUBLICATION",
    state: workflowReadinessStates.pendingValidation,
  },
} as const satisfies Record<
  string,
  Readonly<{ gate: string; state: WorkflowReadinessState }>
>;

export type WorkflowKey = keyof typeof workflowReadiness;

export type WorkflowCopy<T> = Readonly<{
  production: T;
  development: T;
}>;

export function isWorkflowReady(workflow: WorkflowKey): boolean {
  return (
    (workflowReadiness[workflow].state as WorkflowReadinessState) ===
    workflowReadinessStates.ready
  );
}

export function copyForWorkflow<T>(
  workflow: WorkflowKey,
  copy: WorkflowCopy<T>,
): T {
  return isWorkflowReady(workflow) ? copy.production : copy.development;
}
