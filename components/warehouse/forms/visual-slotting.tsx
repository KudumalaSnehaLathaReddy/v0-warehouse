import { useMemo, useState } from "react";
import type { StockInRequest, StructureData, RotationStrategy, Level, Partition } from "../types";
import { findAvailablePartitions } from "../utils";

interface VisualSlottingProps {
  request: StockInRequest | null;
  structures: Array<StructureData & Record<string, unknown>>;
  onSelectStrategy: (strategy: RotationStrategy) => void;
  onAssignPartitions: (assignments: Array<{ structureId: string; levelId: string; partitionId: string; quantity: number }>) => void;
}

export function VisualSlotting({
  request,
  structures,
  onSelectStrategy,
  onAssignPartitions,
}: VisualSlottingProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<RotationStrategy>("FIFO");

  const assignments = useMemo(() => {
    if (!request || !request.productQuantity) return [];
    return findAvailablePartitions(structures, request.productQuantity, selectedStrategy);
  }, [request, structures, selectedStrategy]);

  const handleStrategyChange = (strategy: RotationStrategy) => {
    setSelectedStrategy(strategy);
    onSelectStrategy(strategy);
  };

  const handleAssign = () => {
    if (assignments.length === 0) {
      alert("No available partitions to assign");
      return;
    }

    onAssignPartitions(
      assignments.map((a) => ({
        structureId: a.structureId,
        levelId: a.levelId,
        partitionId: a.partitionId,
        quantity: a.quantity,
      }))
    );
  };

  if (!request || request.status !== "approved") {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground text-center py-4">
          Approve a request first to see visual slotting
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-card-foreground mb-3">
          Visual Slotting - {request.productName}
        </h3>
      </div>

      {/* Strategy Selection */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Rotation Strategy
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["FIFO", "FEFO", "LIFO"] as const).map((strategy) => (
            <button
              key={strategy}
              onClick={() => handleStrategyChange(strategy)}
              className={`px-3 py-2 text-xs font-medium rounded-md border transition ${
                selectedStrategy === strategy
                  ? "border-ring bg-primary text-primary-foreground"
                  : "border-input bg-background hover:border-ring"
              }`}
            >
              {strategy}
            </button>
          ))}
        </div>
      </div>

      {/* Warehouse Grid Visualization */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">
          Available Partitions: {assignments.length}
        </p>

        {structures.length === 0 ? (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No structures available
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {structures.map((structure) => (
              <div key={structure.id} className="border border-border rounded-md p-3 bg-background">
                <p className="text-xs font-semibold text-foreground mb-2">{structure.label || structure.code}</p>

                {/* Levels and Partitions */}
                <div className="space-y-2">
                  {((structure.levels as Level[]) || []).map((level, levelIdx) => (
                    <div key={level.id} className="flex flex-wrap gap-1">
                      {(level.partitions || []).map((partition: Partition) => {
                        const assignment = assignments.find(
                          (a) => a.partitionId === partition.id
                        );
                        const isAssigned = !!assignment;

                        return (
                          <div
                            key={partition.id}
                            className={`p-2 rounded text-xs font-medium text-center min-w-12 transition cursor-pointer border ${
                              isAssigned
                                ? "bg-green-100 border-green-400 text-green-800"
                                : "bg-gray-100 border-gray-300 text-gray-700 hover:border-blue-300"
                            }`}
                            title={`L${levelIdx + 1}-${partition.code} - Cap: ${partition.max_capacity - partition.used_capacity}/${partition.max_capacity}`}
                          >
                            <div>{partition.code}</div>
                            {isAssigned && (
                              <div className="text-[10px] font-bold">{assignment.quantity}u</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignment Summary */}
      {assignments.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs font-medium text-blue-900 mb-2">Assignment Summary:</p>
          <div className="space-y-1 text-xs text-blue-800">
            {assignments.map((a, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{a.partitionCode}</span>
                <span className="font-semibold">{a.quantity} units</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Button */}
      <button
        onClick={handleAssign}
        disabled={assignments.length === 0}
        className="w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Assign {request.productQuantity} Units
      </button>
    </div>
  );
}
