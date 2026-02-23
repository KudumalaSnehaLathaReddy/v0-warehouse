// Outbound Request Types
export type OrderType = 'sales-order' | 'transfer-order' | 'return-order';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
export type RotationStrategy = 'fifo' | 'fefo' | 'lifo';
export type PickingStatus = 'pending' | 'picked' | 'verified' | 'discrepancy' | 'completed';
export type DockStatus = 'available' | 'occupied' | 'maintenance';
export type VehicleEventType = 'entry' | 'exit';

export interface OutboundRequest {
  requestId: string;
  orderNumber: string;
  orderType: OrderType;
  customerName: string;
  destinationLocation: string;
  requestDate: string;
  status: RequestStatus;
  totalItems: number;
  totalUnits: number;
  notes?: string;
  items: OutboundItem[];
}

export interface OutboundItem {
  itemId: string;
  sku: string;
  productName: string;
  quantity: number;
  unit: string;
  batchNumber?: string;
  expiryDate?: string;
}

export interface PickingList {
  pickingListId: string;
  dispatchRefNumber: string;
  requestId: string;
  createdDate: string;
  suggestedStrategy: RotationStrategy;
  items: PickingLineItem[];
  totalLines: number;
}

export interface PickingLineItem {
  lineItemId: string;
  sku: string;
  productName: string;
  requestedQty: number;
  pickedQty: number;
  status: PickingStatus;
  binLocation?: string;
  batchNumber?: string;
  discrepancies: PickingDiscrepancy[];
}

export interface PickingDiscrepancy {
  discrepancyId: string;
  type: 'quantity-mismatch' | 'damaged' | 'missing' | 'wrong-batch';
  severity: 'low' | 'medium' | 'high';
  description: string;
  reportedBy?: string;
  reportedDate?: string;
}

export interface StrategyRecommendation {
  strategy: RotationStrategy;
  cost: number;
  efficiency: number;
  coverage: number;
  description: string;
}

export interface DockAssignment {
  dockId: string;
  dockName: string;
  capacity: number;
  occupiedCapacity: number;
  status: DockStatus;
  assignedDispatchRefNumber?: string;
  estimatedReadyTime?: string;
  notes?: string;
}

export interface VehicleLog {
  vehicleLogId: string;
  vehicleRegNumber: string;
  vehicleType: string;
  driverName: string;
  event: VehicleEventType;
  timestamp: string;
  dockAssignment?: string;
  dispatchRefNumber?: string;
  gatePassNumber?: string;
}

export interface ShippingManifest {
  manifestId: string;
  dispatchRefNumber: string;
  manifestDate: string;
  gatePassNumber: string;
  vehicleRegNumber: string;
  driverName: string;
  totalPackages: number;
  totalWeight?: number;
  destination: string;
  items: ManifestLineItem[];
  qrCode?: string;
  status: 'draft' | 'finalized' | 'shipped';
}

export interface ManifestLineItem {
  sku: string;
  productName: string;
  quantity: number;
  packageNumber: string;
  batchNumber?: string;
}

export interface OutboundWorkflowState {
  currentStage: number;
  request: OutboundRequest | null;
  pickingList: PickingList | null;
  strategyRecommendations: StrategyRecommendation[] | null;
  selectedStrategy: RotationStrategy | null;
  dockAssignment: DockAssignment | null;
  vehicleLog: VehicleLog | null;
  shippingManifest: ShippingManifest | null;
  completionStatus: 'in-progress' | 'completed';
}
