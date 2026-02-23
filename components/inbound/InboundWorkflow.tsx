'use client';

import React, { useState } from 'react';
import { WorkflowState, WorkflowStage, RequestData, GRNData, StrategyAssignmentData, InventoryItem, Discrepancy, GatePass } from '@/types/inbound';
import { ProgressStepper } from './workflow/ProgressStepper';
import { RequestCreation } from './stages/RequestCreation';
import { ManagerApproval } from './stages/ManagerApproval';
import { StrategyAssignment } from './stages/StrategyAssignment';
import { GateLogistics } from './stages/GateLogistics';
import { UnloadingInspection } from './stages/UnloadingInspection';
import { PutAway } from './stages/PutAway';
import { StatusBadge } from './shared/StatusBadge';
import { ActionButton } from './shared/ActionButton';
import { CheckCircle, RotateCw } from 'lucide-react';

const stepsConfig = [
  { id: 'request-creation' as WorkflowStage, title: 'Request', description: 'Create request' },
  { id: 'manager-approval' as WorkflowStage, title: 'Approval', description: 'Manager approves' },
  { id: 'strategy-assignment' as WorkflowStage, title: 'Strategy', description: 'Assign location' },
  { id: 'gate-logistics' as WorkflowStage, title: 'Gate Logistics', description: 'Vehicle passes' },
  { id: 'unloading-inspection' as WorkflowStage, title: 'Inspection', description: 'Unload & inspect' },
  { id: 'put-away' as WorkflowStage, title: 'Put-Away', description: 'Bin placement' },
  { id: 'completed' as WorkflowStage, title: 'Completed', description: 'Finished' },
];

export const InboundWorkflow: React.FC = () => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStage: 'request-creation',
    requestData: null,
    grnData: null,
    strategyData: null,
    entryPassData: null,
    exitPassData: null,
    inventoryItems: [],
    inspectionStatus: 'pending',
    discrepancies: [],
    putAwayItems: [],
    completedAt: null,
    approvalHistory: [],
  });

  const [loading, setLoading] = useState(false);

  const handleRequestCreation = (requestData: RequestData) => {
    setLoading(true);
    setTimeout(() => {
      setWorkflowState((prev) => ({
        ...prev,
        requestData,
        currentStage: 'manager-approval',
      }));
      setLoading(false);
    }, 500);
  };

  const handleManagerApprove = (grnData: GRNData) => {
    setLoading(true);
    setTimeout(() => {
      setWorkflowState((prev) => ({
        ...prev,
        grnData,
        currentStage: 'strategy-assignment',
        approvalHistory: [
          ...prev.approvalHistory,
          {
            stagedRequiredAt: 'manager-approval',
            approvedAt: new Date().toISOString(),
            approvedBy: 'Current Manager',
            decision: 'approved',
          },
        ],
      }));
      setLoading(false);
    }, 500);
  };

  const handleManagerReject = (reason: string) => {
    setLoading(true);
    setTimeout(() => {
      setWorkflowState((prev) => ({
        ...prev,
        currentStage: 'request-creation',
        approvalHistory: [
          ...prev.approvalHistory,
          {
            stagedRequiredAt: 'manager-approval',
            approvedAt: new Date().toISOString(),
            approvedBy: 'Current Manager',
            decision: 'rejected',
            rejectionReason: reason,
          },
        ],
      }));
      setLoading(false);
    }, 500);
  };

  const handleStrategyAssignment = (strategyData: StrategyAssignmentData) => {
    setLoading(true);
    setTimeout(() => {
      setWorkflowState((prev) => ({
        ...prev,
        strategyData,
        currentStage: 'gate-logistics',
      }));
      setLoading(false);
    }, 500);
  };

  const handleGateLogistics = (entryPass: GatePass, exitPass?: GatePass) => {
    setLoading(true);
    setTimeout(() => {
      setWorkflowState((prev) => ({
        ...prev,
        entryPassData: entryPass,
        exitPassData: exitPass || null,
        currentStage: 'unloading-inspection',
      }));
      setLoading(false);
    }, 500);
  };

  const handleUnloadingInspection = (items: InventoryItem[], discrepancies: Discrepancy[]) => {
    setLoading(true);
    setTimeout(() => {
      setWorkflowState((prev) => ({
        ...prev,
        inventoryItems: items,
        discrepancies,
        inspectionStatus: discrepancies.length > 0 ? 'issues-found' : 'completed',
        currentStage: 'put-away',
      }));
      setLoading(false);
    }, 500);
  };

  const handlePutAwayComplete = () => {
    setLoading(true);
    setTimeout(() => {
      setWorkflowState((prev) => ({
        ...prev,
        currentStage: 'completed',
        completedAt: new Date().toISOString(),
      }));
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setWorkflowState({
      currentStage: 'request-creation',
      requestData: null,
      grnData: null,
      strategyData: null,
      entryPassData: null,
      exitPassData: null,
      inventoryItems: [],
      inspectionStatus: 'pending',
      discrepancies: [],
      putAwayItems: [],
      completedAt: null,
      approvalHistory: [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-accent-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Warehouse Inbound Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage stock-in operations across your warehouse locations
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ProgressStepper steps={stepsConfig} currentStep={workflowState.currentStage} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {workflowState.currentStage === 'completed' ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
            <div className="w-24 h-24 rounded-full bg-status-success/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-status-success" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-3xl font-bold text-foreground">Workflow Complete</h2>
              <p className="text-muted-foreground">
                The inbound shipment has been successfully processed and all items have been placed in their designated storage locations.
              </p>
            </div>

            {/* Final Summary */}
            <div className="w-full max-w-2xl space-y-4 p-6 bg-card rounded-lg border border-border">
              {workflowState.requestData && (
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Request</p>
                  <p className="text-foreground mt-1">
                    {workflowState.requestData.supplierName} - {workflowState.requestData.purchaseOrderNumber}
                  </p>
                </div>
              )}

              {workflowState.grnData && (
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase">GRN</p>
                  <p className="text-lg font-mono font-bold text-foreground mt-1">{workflowState.grnData.grnNumber}</p>
                </div>
              )}

              {workflowState.strategyData && (
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Storage Location & Strategy</p>
                  <p className="text-foreground mt-1">
                    {workflowState.strategyData.locationName} - {workflowState.strategyData.rotationStrategy}
                  </p>
                </div>
              )}

              {workflowState.completedAt && (
                <div className="text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Completion Time</p>
                  <p className="text-sm text-foreground font-mono mt-1">
                    {new Date(workflowState.completedAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="text-left pt-4 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase">Summary</p>
                <div className="text-sm text-foreground space-y-1 mt-2">
                  <p>Items Received: {workflowState.inventoryItems.length}</p>
                  <p>Discrepancies: {workflowState.discrepancies.length}</p>
                  <p>
                    Inspection Status:{' '}
                    <span className="capitalize">
                      {workflowState.inspectionStatus === 'issues-found' ? '⚠ Issues Found' : '✓ All Clear'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <ActionButton
              onClick={handleReset}
              variant="primary"
              icon={RotateCw}
              size="lg"
            >
              Start New Inbound Request
            </ActionButton>
          </div>
        ) : workflowState.currentStage === 'request-creation' ? (
          <RequestCreation onSubmit={handleRequestCreation} loading={loading} />
        ) : workflowState.currentStage === 'manager-approval' && workflowState.requestData ? (
          <ManagerApproval
            requestData={workflowState.requestData}
            onApprove={handleManagerApprove}
            onReject={handleManagerReject}
            loading={loading}
          />
        ) : workflowState.currentStage === 'strategy-assignment' && workflowState.requestData ? (
          <StrategyAssignment
            expectedQuantity={workflowState.requestData.expectedQuantity}
            unitOfMeasure={workflowState.requestData.unitOfMeasure}
            onSubmit={handleStrategyAssignment}
            loading={loading}
          />
        ) : workflowState.currentStage === 'gate-logistics' && workflowState.grnData ? (
          <GateLogistics
            grnNumber={workflowState.grnData.grnNumber}
            onSubmit={handleGateLogistics}
            loading={loading}
          />
        ) : workflowState.currentStage === 'unloading-inspection' && workflowState.requestData ? (
          <UnloadingInspection
            expectedQuantity={workflowState.requestData.expectedQuantity}
            unitOfMeasure={workflowState.requestData.unitOfMeasure}
            onSubmit={handleUnloadingInspection}
            loading={loading}
          />
        ) : workflowState.currentStage === 'put-away' && workflowState.strategyData ? (
          <PutAway
            items={workflowState.inventoryItems}
            assignedLocation={workflowState.strategyData.locationName}
            rotationStrategy={workflowState.strategyData.rotationStrategy}
            onComplete={handlePutAwayComplete}
            loading={loading}
          />
        ) : null}
      </div>
    </div>
  );
};
