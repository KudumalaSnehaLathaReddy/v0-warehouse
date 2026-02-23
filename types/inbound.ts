/**
 * Warehouse Inbound Management System - Type Definitions
 */

export type WorkflowStage = 'request-creation' | 'manager-approval' | 'strategy-assignment' | 'gate-logistics' | 'unloading-inspection' | 'put-away' | 'completed';

export type InventoryRotationStrategy = 'FIFO' | 'FEFO' | 'LIFO';

export type DiscrepancyType = 'damaged' | 'missing' | 'quantity-mismatch';

export type DamageSeverity = 'minor' | 'major' | 'complete-loss';

export type ItemStatus = 'ok' | 'damaged' | 'missing' | 'pending-inspection';

export interface RequestData {
  requestId: string;
  supplierId: string;
  supplierName: string;
  purchaseOrderNumber: string;
  expectedQuantity: number;
  unitOfMeasure: string;
  arrivalDateTime: string;
  specialInstructions: string;
  createdAt: string;
}

export interface GRNData {
  grnNumber: string;
  requestId: string;
  consolidatedDetails: {
    supplierId: string;
    supplierName: string;
    purchaseOrderNumber: string;
    expectedQuantity: number;
    unitOfMeasure: string;
  };
  generatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface WarehouseLocation {
  locationId: string;
  zone: string;
  section: string;
  capacity: number;
  currentUtilization: number;
  isAvailable: boolean;
}

export interface StrategyAssignmentData {
  locationId: string;
  locationName: string;
  rotationStrategy: InventoryRotationStrategy;
  assignedAt: string;
}

export interface GatePass {
  passId: string;
  passType: 'entry' | 'exit';
  vehicleRegNumber: string;
  driverName: string;
  vehicleType: string;
  timestamp: string;
  qrCode: string;
}

export interface InventoryItem {
  itemId: string;
  description: string;
  expectedQuantity: number;
  receivedQuantity?: number;
  status: ItemStatus;
  sku?: string;
  batchNumber?: string;
  expiryDate?: string;
}

export interface Discrepancy {
  discrepancyId: string;
  itemId: string;
  type: DiscrepancyType;
  damageSeverity?: DamageSeverity;
  notes: string;
  photoUrl?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface PutAwayItem {
  itemId: string;
  description: string;
  quantity: number;
  assignedBinLocation: string;
  confirmationStatus: 'pending' | 'confirmed' | 'completed';
  completedAt?: string;
}

export interface WorkflowState {
  currentStage: WorkflowStage;
  requestData: RequestData | null;
  grnData: GRNData | null;
  strategyData: StrategyAssignmentData | null;
  entryPassData: GatePass | null;
  exitPassData: GatePass | null;
  inventoryItems: InventoryItem[];
  inspectionStatus: 'pending' | 'in-progress' | 'completed' | 'issues-found';
  discrepancies: Discrepancy[];
  putAwayItems: PutAwayItem[];
  completedAt: string | null;
  approvalHistory: ApprovalRecord[];
}

export interface ApprovalRecord {
  stagedRequiredAt: WorkflowStage;
  approvedAt: string;
  approvedBy: string;
  decision: 'approved' | 'rejected';
  rejectionReason?: string;
}

export interface FormErrors {
  [key: string]: string;
}
