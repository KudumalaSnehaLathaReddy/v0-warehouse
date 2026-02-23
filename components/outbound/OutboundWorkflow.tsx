'use client';

// Build version: v1.0.2 - Cache invalidation
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { OutboundRequest } from '@/types/outbound';
import { ProgressStepper } from '@/components/inbound/workflow/ProgressStepper';
import { RequestCreation } from './stages/RequestCreation';
import { ManagerApproval } from './stages/ManagerApproval';
import { StrategyLogic } from './stages/StrategyLogic';
import { PickingPacking } from './stages/PickingPacking';
import { DockAssignment as DockStage } from './stages/DockAssignment';
import { VehicleLog as VehicleLogStage } from './stages/VehicleLog';
import { ShippingManifest as ManifestStage } from './stages/ShippingManifest';
import { StatusBadge } from '@/components/inbound/shared/StatusBadge';

type OutboundStage = 'request' | 'approval' | 'strategy' | 'picking' | 'dock' | 'vehicle' | 'manifest' | 'completed';

const stepsConfig: Array<{ id: OutboundStage; title: string; description: string }> = [
  { id: 'request', title: 'Request', description: 'Create outbound request' },
  { id: 'approval', title: 'Approval', description: 'Manager approves and generates list' },
  { id: 'strategy', title: 'Strategy', description: 'Select rotation strategy' },
  { id: 'picking', title: 'Picking', description: 'Pick and pack items' },
  { id: 'dock', title: 'Dock', description: 'Assign dock location' },
  { id: 'vehicle', title: 'Vehicle', description: 'Log vehicle entry/exit' },
  { id: 'manifest', title: 'Manifest', description: 'Generate shipping manifest' },
  { id: 'completed', title: 'Completed', description: 'Dispatch completed' },
];

export function OutboundWorkflow() {
  const [state, setState] = useState<OutboundWorkflowState>({
    currentStage: 0,
    request: null,
    pickingList: null,
    strategyRecommendations: null,
    selectedStrategy: null,
    dockAssignment: null,
    vehicleLog: null,
    shippingManifest: null,
    completionStatus: 'in-progress',
  });

  const handleRequestSubmit = (request: OutboundRequest) => {
    setState({
      ...state,
      request,
      currentStage: 1,
    });
  };

  const handleApproveRequest = (pickingList: PickingList) => {
    setState({
      ...state,
      pickingList,
      currentStage: 2,
    });
  };

  const handleRejectRequest = () => {
    setState({
      ...state,
      request: null,
      currentStage: 0,
    });
  };

  const handleStrategySelect = (strategy: RotationStrategy) => {
    setState({
      ...state,
      selectedStrategy: strategy,
      currentStage: 3,
    });
  };

  const handlePickingComplete = () => {
    if (state.pickingList) {
      setState({
        ...state,
        currentStage: 4,
      });
    }
  };

  const handleDockAssigned = (dock: DockAssignment) => {
    setState({
      ...state,
      dockAssignment: dock,
      currentStage: 5,
    });
  };

  const handleVehicleExit = (log: VehicleLog) => {
    setState({
      ...state,
      vehicleLog: log,
      currentStage: 6,
    });
  };

  const handleManifestFinalize = (manifest: ShippingManifest) => {
    setState({
      ...state,
      shippingManifest: manifest,
      currentStage: 7,
      completionStatus: 'completed',
    });
  };

  const handleNewRequest = () => {
    setState({
      currentStage: 0,
      request: null,
      pickingList: null,
      strategyRecommendations: null,
      selectedStrategy: null,
      dockAssignment: null,
      vehicleLog: null,
      shippingManifest: null,
      completionStatus: 'in-progress',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Outbound Management</h1>
                <p className="text-sm text-muted-foreground">
                  Stock-out operations workflow
                </p>
              </div>
            </div>
            {state.completionStatus === 'completed' && (
              <StatusBadge status="completed" label="Dispatch Completed" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-card border-b border-border sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {stepsConfig && stepsConfig.length > 0 && (
            <ProgressStepper
              steps={stepsConfig}
              currentStep={
                typeof state.currentStage === 'number' && state.currentStage >= 0 && state.currentStage < stepsConfig.length
                  ? stepsConfig[state.currentStage]?.id || 'request'
                  : 'request'
              }
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stage 0: Request Creation */}
        {state.currentStage === 0 && (
          <RequestCreation onRequestSubmit={handleRequestSubmit} />
        )}

        {/* Stage 1: Manager Approval */}
        {state.currentStage === 1 && state.request && (
          <ManagerApproval
            request={state.request}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        )}

        {/* Stage 2: Strategy Logic */}
        {state.currentStage === 2 && state.pickingList && (
          <StrategyLogic
            dispatchRefNumber={state.pickingList.dispatchRefNumber}
            totalItems={state.pickingList.items.length}
            onStrategySelect={handleStrategySelect}
          />
        )}

        {/* Stage 3: Picking & Packing */}
        {state.currentStage === 3 && state.pickingList && (
          <PickingPacking
            pickingList={state.pickingList}
            onPickingComplete={handlePickingComplete}
          />
        )}

        {/* Stage 4: Dock Assignment */}
        {state.currentStage === 4 && state.pickingList && (
          <DockStage
            dispatchRefNumber={state.pickingList.dispatchRefNumber}
            totalPackages={state.pickingList.totalLines}
            onDockAssigned={handleDockAssigned}
          />
        )}

        {/* Stage 5: Vehicle Entry/Exit Log */}
        {state.currentStage === 5 && state.pickingList && state.dockAssignment && (
          <VehicleLogStage
            dispatchRefNumber={state.pickingList.dispatchRefNumber}
            dockName={state.dockAssignment.dockName}
            onVehicleExit={handleVehicleExit}
          />
        )}

        {/* Stage 6: Shipping Manifest */}
        {state.currentStage === 6 && state.pickingList && state.vehicleLog && (
          <ManifestStage
            dispatchRefNumber={state.pickingList.dispatchRefNumber}
            vehicleLog={state.vehicleLog}
            totalPackages={state.pickingList.totalLines}
            onManifestFinalize={handleManifestFinalize}
          />
        )}

        {/* Stage 7: Completion */}
        {state.currentStage === 7 && state.shippingManifest && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="inline-block p-3 bg-status-success/10 rounded-full mb-4">
                <svg className="w-12 h-12 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Dispatch Completed Successfully</h2>
              <p className="text-muted-foreground mb-4">
                Order {state.request?.orderNumber} has been successfully dispatched
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Gate Pass: <span className="font-semibold text-foreground">{state.shippingManifest.gatePassNumber}</span>
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Final Summary</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Order Number</p>
                  <p className="text-lg font-bold text-foreground">{state.request?.orderNumber}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Dispatch Reference</p>
                  <p className="text-lg font-bold text-accent">{state.shippingManifest.dispatchRefNumber}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Registration</p>
                  <p className="text-lg font-bold text-foreground">{state.shippingManifest.vehicleRegNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Packages</p>
                  <p className="text-lg font-bold text-foreground">{state.shippingManifest.totalPackages}</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total Weight</p>
                  <p className="text-lg font-bold text-foreground">{state.shippingManifest.totalWeight} kg</p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Destination</p>
                  <p className="text-lg font-bold text-foreground">{state.shippingManifest.destination}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleNewRequest}
                className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent-secondary transition-colors"
              >
                Start New Dispatch
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
