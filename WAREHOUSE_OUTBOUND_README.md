# Warehouse Outbound Management System - Frontend UI

A comprehensive, state-driven frontend interface for managing warehouse stock-out (outbound) operations across multiple warehouse locations. This system guides users through a complete lifecycle of inventory removal from request creation through final dispatch confirmation.

## Overview

The Outbound Management System is a 7-stage workflow that manages the complete lifecycle of shipping inventory out of the warehouse. Each stage is fully interactive with real-time validation, auto-generated reference numbers, and comprehensive discrepancy tracking.

### Key Features

- **7-Stage Linear Workflow**: State-driven progression from Request Creation through Dispatch Completion
- **Auto-Generated Documents**: Dispatch Reference Numbers (DRN), Picking Lists, and Gate Passes
- **Intelligent Strategy Logic**: FIFO, FEFO, LIFO rotation suggestions with efficiency metrics
- **Real-Time Discrepancy Reporting**: Track and report damaged, missing, or mismatched items
- **Capacity Visualization**: Dynamic dock assignment with available space indicators
- **Vehicle Coordination**: Entry/exit logging with QR-based gate pass generation
- **Comprehensive Manifests**: Shipping manifests with complete item tracking
- **Frontend-Only Implementation**: No backend dependencies, all data in React state

## Workflow Stages

### Stage 1: Request Creation
Users initiate outbound requests by specifying:
- Order type (Sales Order, Transfer Order, or Return Order)
- Order number and customer information
- Destination location
- Line items with quantities and details

Mock sample data is pre-loaded for demonstration.

### Stage 2: Manager Approval
Managers review requests and approve/reject with:
- Auto-generated Dispatch Reference Number (DRN)
- Auto-generated Picking List with unique ID
- Suggested rotation strategy (FIFO by default)
- Request summary and validation

The system automatically consolidates all request details in the picking list.

### Stage 3: Strategy Logic
Intelligent recommendations for inventory rotation:
- **FIFO**: First In, First Out - Standard approach, minimizes obsolescence
- **FEFO**: First Expire, First Out - Critical for perishable goods
- **LIFO**: Last In, First Out - Fastest picking, minimal travel

Each strategy shows:
- Cost efficiency percentage
- Pick efficiency metrics
- Coverage percentage
- Estimated picking time and resource allocation

### Stage 4: Picking & Packing
Workers verify and confirm inventory removal:
- Search inventory by SKU or product name
- Enter picked quantities for each item
- Scan batch numbers for verification
- Report discrepancies (quantity mismatch, damage, missing items, wrong batch)
- Severity classification (low, medium, high)
- Real-time progress tracking (completion percentage)

### Stage 5: Dock Assignment
Assign shipment to available loading docks:
- View real-time capacity of all docks
- Visual capacity bars with color-coded usage levels
- Available space indicators
- Dock status (Available, Occupied, Maintenance)
- Estimated ready time calculation
- Space requirement validation (prevents over-assignment)

### Stage 6: Vehicle Entry/Exit Log
Coordinate vehicle transport:
- Record vehicle entry with registration, type, and driver
- Gate pass generation with unique number
- Vehicle loading status tracking
- Vehicle exit confirmation
- Activity log of all entry/exit events

### Stage 7: Shipping Manifest & Gate Pass
Final dispatch document generation:
- QR code-based gate pass for vehicle authorization
- Detailed manifest with all shipment details
- Vehicle and destination information
- Complete item listing with batch numbers
- Download manifest as text file
- Manifest finalization marking dispatch complete

### Stage 8: Completion
Confirmation screen showing:
- Final order summary
- Dispatch reference and gate pass numbers
- Vehicle and destination details
- Total packages and weight
- Option to start new dispatch

## Component Structure

### Type Definitions (`types/outbound.ts`)
Comprehensive TypeScript interfaces for:
- `OutboundRequest`: Request with items and metadata
- `PickingList`: Auto-generated picking list with line items
- `StrategyRecommendation`: FIFO/FEFO/LIFO suggestions with metrics
- `PickingLineItem`: Individual items with picked quantities and discrepancies
- `PickingDiscrepancy`: Issue tracking (type, severity, description)
- `DockAssignment`: Dock allocation with capacity tracking
- `VehicleLog`: Entry/exit events with timestamps
- `ShippingManifest`: Final dispatch document
- `OutboundWorkflowState`: Complete workflow state management

### Stage Components

#### RequestCreation.tsx
- Order type selector (Sales Order, Transfer Order, Return Order)
- Form validation with error messages
- Dynamic item addition/removal
- Pre-populated sample data
- Summary display (total items, total units)

#### ManagerApproval.tsx
- Request summary card
- Auto-generated references display
- Copy-to-clipboard functionality
- Picking list items table
- Suggested strategy indicator
- Approval notes textarea
- Approve/Reject actions

#### StrategyLogic.tsx
- 3-column strategy cards (FIFO, FEFO, LIFO)
- Interactive strategy selection
- Efficiency/cost/coverage metrics with progress bars
- Detailed strategy information
- Resource allocation estimates
- Benefits listing per strategy

#### PickingPacking.tsx
- Progress overview (total, picked, completion %)
- Search bar for SKU/product filtering
- Editable picking quantities
- Batch number scanning
- Real-time status updates
- Modal-based discrepancy reporting
- Discrepancy tracking and display

#### DockAssignment.tsx
- Visual dock cards with status indicators
- Color-coded capacity bars
- Available space calculations
- Capacity percentage indicators
- Space requirement validation
- Selection highlighting
- Detailed assignment summary

#### VehicleLog.tsx
- Vehicle entry form (registration, type, driver)
- Automatic gate pass generation
- Entry timestamp recording
- Vehicle loaded status display
- Vehicle exit confirmation
- Activity log table with all events
- Real-time event tracking

#### ShippingManifest.tsx
- Gate pass QR code generation and display
- Vehicle and destination details
- Shipped items table
- Manifest summary with ID and status
- Download manifest as text file
- Finalization action

### Orchestrator Component (OutboundWorkflow.tsx)
Central state management component that:
- Manages complete workflow state
- Routes to appropriate stage components
- Handles stage transitions
- Displays progress stepper with all 8 stages
- Shows completion summary
- Enables starting new dispatches

### Reused Components from Inbound Module
- `StatusBadge`: Status indicators with color coding
- `ProgressStepper`: Multi-stage workflow visualization
- `ActionButton`: Consistent button styling
- `DataTable`: Searchable data table with columns

## Data Flow

1. **Request Creation** → User submits outbound request with items
2. **Manager Approval** → System auto-generates DRN & Picking List
3. **Strategy Logic** → User selects rotation strategy
4. **Picking & Packing** → Workers verify quantities, report issues
5. **Dock Assignment** → Manager assigns available dock
6. **Vehicle Log** → Record vehicle entry/exit
7. **Shipping Manifest** → Generate final dispatch document
8. **Completion** → Display dispatch confirmation

All data remains in React state throughout the workflow.

## Styling & Design

- **Color Scheme**: Professional navy, orange, and coral accents matching logistics branding
- **Layout**: Flexbox-based responsive grid system
- **UI Patterns**: Cards, progress bars, status badges, modals
- **Typography**: Clear hierarchy with semantic font sizes
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

## Mock Data

The system includes pre-loaded mock data for demonstration:
- Sample supplier information
- Warehouse locations with realistic details
- Inventory items with SKUs and quantities
- Dock configurations with capacity data
- Vehicle types and driver names

All data is mutable and persists in React state during the session.

## File Structure

```
components/outbound/
├── OutboundWorkflow.tsx          # Main orchestrator
├── stages/
│   ├── RequestCreation.tsx       # Stage 1
│   ├── ManagerApproval.tsx       # Stage 2
│   ├── StrategyLogic.tsx         # Stage 3
│   ├── PickingPacking.tsx        # Stage 4
│   ├── DockAssignment.tsx        # Stage 5
│   ├── VehicleLog.tsx            # Stage 6
│   └── ShippingManifest.tsx      # Stage 7
types/
├── outbound.ts                   # Type definitions
app/outbound/
├── page.tsx                      # Route component
└── layout.tsx                    # Layout metadata
```

## Navigation

Access the Outbound Workflow at `/outbound` or use the navigation button in the main page header.

## Future Enhancements

When backend integration is added, consider:
- API endpoints for request validation
- Database persistence of workflows
- Real-time inventory queries
- Integration with warehouse management system
- User authentication and RBAC
- Notification system for approvals
- Audit logging for compliance
- Multi-warehouse support

## Technical Stack

- **Frontend Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: lucide-react
- **State Management**: React hooks
- **QR Codes**: qrcode library
- **Form Validation**: Zod (when needed)
- **Type Safety**: TypeScript

The system is production-ready for frontend deployment and can be connected to backend APIs for complete functionality.
