'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { WorkflowStage } from '@/types/inbound';

interface Step {
  id: WorkflowStage;
  title: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: WorkflowStage;
}

const stageLabels: Record<WorkflowStage, { title: string; description: string }> = {
  'request-creation': { title: 'Request', description: 'Create stock-in request' },
  'manager-approval': { title: 'Approval', description: 'Manager reviews and approves' },
  'strategy-assignment': { title: 'Strategy', description: 'Assign storage location & rotation' },
  'gate-logistics': { title: 'Gate Logistics', description: 'Generate vehicle passes' },
  'unloading-inspection': { title: 'Inspection', description: 'Unload and inspect items' },
  'put-away': { title: 'Put-Away', description: 'Confirm bin placement' },
  'completed': { title: 'Completed', description: 'Workflow finished' },
};

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          const config = stageLabels[step.id];

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? 'bg-status-success text-white'
                      : isCurrent
                        ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 dark:ring-offset-gray-900'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {config.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{config.description}</p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    isCompleted || isCurrent ? 'bg-status-success' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  style={{ minWidth: '2rem' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
