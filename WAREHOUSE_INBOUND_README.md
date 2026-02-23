# Warehouse Inbound Management System - UI Implementation

## Overview

This is a high-fidelity, end-to-end frontend implementation of a **Warehouse Inbound Management System** that tracks the complete lifecycle of stock-in operations across multiple warehouse locations. The system follows a linear, state-driven workflow from request creation through final put-away confirmation.

## Access the Application

Navigate to `/inbound` to access the warehouse inbound management workflow interface.

## Workflow Stages

### 1. **Request Creation** (`/inbound` - Stage 1)
- User initiates a new stock-in request by selecting a supplier and entering shipment details
- Form fields include:
  - **Supplier Selection**: Dropdown with mock supplier options
  - **Purchase Order Number**: Required identifier
  - **Expected Quantity & UOM**: Number input with unit selection
  - **Arrival Date & Time**: DateTime picker
  - **Special Instructions**: Optional textarea
- Client-side validation using React state
- Auto-generates unique Request ID upon submission
- Live preview of request summary

### 2. **Manager Approval with Auto-Generated GRN** (`/inbound` - Stage 2)
- Displays the submitted request details in read-only format
- **Automatic GRN (Goods Received Note) Generation**:
  - System generates unique GRN number consolidating all request details
  - GRN displays timestamp, request ID, supplier info, PO number, and quantities
  - GRN is stored and linked to the workflow
- Two-button approval workflow:
  - **Approve**: Proceeds to Strategy Assignment
  - **Reject**: Opens rejection reason form, returns to Request Creation
- Rejection workflow includes reason capture and re-submission capability

### 3. **Strategy Assignment** (`/inbound` - Stage 3)
- **Storage Location Selection**:
  - Interactive location cards showing real-time capacity utilization
  - Visual progress bars for each location's usage
  - Color-coded availability status (Available/At Capacity/Unavailable)
  - Mock warehouse locations (Zone A, Zone B, Zone C)
- **Rotation Strategy Selection**:
  - **FIFO** (First In, First Out): For perishables and expiring items
  - **FEFO** (First Expired, First Out): For items with varying expiry dates
  - **LIFO** (Last In, First Out): For non-perishable goods
- Validation ensures sufficient capacity for incoming items
- Assignment summary displays selected configuration

### 4. **Gate Logistics** (`/inbound` - Stage 4)
- **Vehicle Entry Pass Generation**:
  - Form captures vehicle registration, driver name, vehicle type
  - Generates unique Entry Pass ID
  - Creates QR code for gate scanning
  - Displays printable pass with all details
- **Vehicle Exit Pass Generation** (after unloading):
  - Requires confirmation that all items are unloaded
  - Generates unique Exit Pass ID
  - Creates separate QR code for exit validation
  - Printable exit pass format
- Both passes contain encoded data including GRN reference and timestamp
- Mock QR code generation using qrcode library

### 5. **Unloading & Inspection** (`/inbound` - Stage 5)
- **Inventory Dashboard**:
  - Summary cards showing expected vs. received quantities
  - Variance calculation (discrepancies at a glance)
  - Overall inspection status badge
- **Searchable Inventory Table**:
  - Columns: Item ID, Description, Expected Qty, Received Qty, Status
  - Status indicators (OK, Damaged, Missing, Pending)
  - Sortable by status, description, or quantity
  - Search functionality for quick item lookup
- **Discrepancy Reporting**:
  - Modal form to report damaged/missing items
  - Discrepancy type selector (Damaged, Missing, Quantity Mismatch)
  - Damage severity classification (Minor, Major, Complete Loss) - conditional
  - Photo upload placeholder for evidence
  - Detailed notes textarea with character counter
  - All discrepancies tracked with unique IDs and timestamps
- Discrepancy Report Section showing all reported issues with details
- Completion only allowed once inspection is finished

### 6. **Put-Away** (`/inbound` - Stage 6)
- **Bin Placement Confirmation**:
  - Table showing all items with assigned bin locations
  - Status tracking (Pending/Confirmed/Completed)
  - Checkboxes for individual item confirmation
  - "Confirm All" button for bulk confirmation
  - Progress bar showing completion percentage
- **Auto-Generated Bin Locations**:
  - Dynamically generates bin addresses based on assigned warehouse location
  - Format: `{Location}-{Shelf}{Row}` (e.g., LOC-A1-01-A1)
- **Completion Summary**:
  - Summary of all stored items and their locations
  - Total units stored confirmation
  - Completion timestamp recording
- Final completion triggers workflow finalization

### 7. **Completion Screen** (`/inbound` - Stage 7)
- Success confirmation with visual indicator
- Final workflow summary showing:
  - Request details and supplier
  - Generated GRN number
  - Storage location and rotation strategy
  - Completion timestamp
  - Total items received
  - Discrepancies summary
- Option to start new inbound request via reset button

## Component Architecture

### Shared Components

#### `StatusBadge` (`components/inbound/shared/StatusBadge.tsx`)
- Displays status with color-coded backgrounds
- Status types: pending, in-progress, approved, rejected, completed, issues, ok, damaged, missing
- Responsive sizing (sm/md/lg) with optional icons
- Theme-aware styling using design tokens

#### `ProgressStepper` (`components/inbound/workflow/ProgressStepper.tsx`)
- Horizontal step indicator showing all workflow stages
- Completed stages show checkmark
- Current stage highlighted with ring
- Future stages grayed out
- Connecting lines between stages
- Responsive layout with hidden descriptions on mobile

#### `DataTable` (`components/inbound/shared/DataTable.tsx`)
- Reusable searchable and sortable table component
- Column definition system with custom rendering
- Inline search filtering across specified fields
- Click-based sorting with visual indicators
- Pagination with configurable items per page
- Empty state message
- Responsive horizontal scrolling on mobile

#### `ActionButton` (`components/inbound/shared/ActionButton.tsx`)
- Unified button component with variants:
  - primary (accent color)
  - secondary (muted)
  - destructive (red)
  - outline (bordered)
- Icon support (left/right positioning)
- Loading state with spinner
- Tooltip support
- Full-width option
- Focus and disabled states

#### `DiscrepancyForm` (`components/inbound/shared/DiscrepancyForm.tsx`)
- Modal dialog for reporting inventory discrepancies
- Discrepancy type selector (Damaged, Missing, Quantity Mismatch)
- Conditional damage severity field
- Notes textarea with character counter (500 char limit)
- File upload for photo evidence
- Form validation and submission handling

#### `InventoryTable` (`components/inbound/shared/InventoryTable.tsx`)
- Specialized table for inventory items
- Displays expected vs. received quantities
- Status-based highlighting (issues shown with colored backgrounds)
- Quick action buttons for discrepancy marking
- Summary cards showing OK/Damaged/Missing counts
- Search and sort functionality

### Stage Components

#### `RequestCreation.tsx`
- Form with 3 numbered sections
- Supplier dropdown with mock data
- PO number, quantity, and datetime inputs
- Special instructions textarea
- Client-side validation with error messages
- Auto-generated Request ID
- Request summary preview

#### `ManagerApproval.tsx`
- Read-only display of request details
- Auto-generated GRN with unique number
- GRN consolidation details display
- Approve/Reject buttons
- Rejection workflow with reason textarea
- Conditional rendering based on approval state

#### `StrategyAssignment.tsx`
- Interactive location selection cards
- Real-time capacity visualization with progress bars
- Rotation strategy radio buttons with descriptions
- Validation for capacity and availability
- Assignment summary display
- Mock warehouse location data

#### `GateLogistics.tsx`
- Two-phase pass generation (Entry → Exit)
- Entry pass form with vehicle details
- QR code generation and display
- Print functionality
- Exit pass conditional form
- Unload confirmation requirement

#### `UnloadingInspection.tsx`
- Summary cards for expected vs. received quantities
- Searchable and sortable inventory table
- Discrepancy reporting modal integration
- Discrepancy report section with all details
- Inspection status tracking
- Completion workflow

#### `PutAway.tsx`
- Assignment details display (location, strategy, total items)
- Bin placement confirmation table
- Checkbox selection with bulk confirm option
- Progress bar for completion tracking
- Summary statistics
- Completion success screen

### Orchestrator

#### `InboundWorkflow.tsx`
- Main state management component
- Handles transitions between all workflow stages
- Maintains complete workflow state using React hooks
- Calls stage-specific handlers on user actions
- Displays appropriate component based on current stage
- Renders final completion screen with summary
- Reset functionality for new requests

## Design System

### Color Palette
- **Primary**: Navy Blue (#0F1729) - Professional, trust-focused
- **Accent**: Coral Orange (#FF6B35) - Energy, action
- **Accent Secondary**: Dark Orange (#FF5A16) - Hover states
- **Success**: Green (#4ADE80) - Confirmations, positive status
- **Warning**: Amber (#FBBF24) - Warnings, attention needed
- **Error**: Red (#F87171) - Errors, critical issues
- **Info**: Blue (#60A5FA) - Information
- **Background**: Light Gray (#F8F8F9)
- **Foreground**: Dark Navy (#15162B)
- **Muted**: Grays for secondary text and backgrounds

### Typography
- **Headings**: System font (Geist) with bold weights
- **Body**: System font with regular weight
- **Monospace**: Font-mono class for IDs and codes

### Spacing & Layout
- Flexbox for most layouts (mobile-first)
- 4px base unit scale (p-1, p-2, p-4, etc.)
- Rounded corners (8px border-radius)
- Subtle shadows for card elevation

## State Management

All workflow state is managed using React `useState` hooks in the `InboundWorkflow` component. The workflow state object tracks:

```typescript
{
  currentStage: WorkflowStage,
  requestData: RequestData | null,
  grnData: GRNData | null,
  strategyData: StrategyAssignmentData | null,
  entryPassData: GatePass | null,
  exitPassData: GatePass | null,
  inventoryItems: InventoryItem[],
  inspectionStatus: 'pending' | 'in-progress' | 'completed' | 'issues-found',
  discrepancies: Discrepancy[],
  putAwayItems: PutAwayItem[],
  completedAt: string | null,
  approvalHistory: ApprovalRecord[],
}
```

## Mock Data

The system uses mock data for:
- **Suppliers**: 4 mock supplier options
- **Warehouse Locations**: 4 mock locations with capacity data
- **Inventory Items**: 3 generated items per request (40%, 35%, 25% of expected quantity)
- **Vehicle Types**: 5 mock vehicle type options

## Frontend Features (No Backend)

- ✓ Linear state-driven workflow
- ✓ Form validation with error messaging
- ✓ Auto-generated unique IDs (Request ID, GRN, Pass IDs, Discrepancy IDs)
- ✓ QR code generation for gate passes
- ✓ Searchable and sortable data tables
- ✓ Dynamic capacity visualization
- ✓ Color-coded status indicators
- ✓ Modal dialogs for discrepancy reporting
- ✓ Progress tracking and completion indicators
- ✓ Responsive design for all screen sizes
- ✓ Accessibility-focused HTML structure
- ✓ Print-friendly pass layouts

## File Structure

```
components/
  inbound/
    InboundWorkflow.tsx (main orchestrator)
    workflow/
      ProgressStepper.tsx
    stages/
      RequestCreation.tsx
      ManagerApproval.tsx
      StrategyAssignment.tsx
      GateLogistics.tsx
      UnloadingInspection.tsx
      PutAway.tsx
    shared/
      StatusBadge.tsx
      ActionButton.tsx
      DataTable.tsx
      DiscrepancyForm.tsx
      InventoryTable.tsx

app/
  inbound/
    layout.tsx
    page.tsx

types/
  inbound.ts (TypeScript interface definitions)
```

## Navigation

- **Main Page** (`/`): Warehouse canvas with navigation link
- **Inbound Workflow** (`/inbound`): Main workflow interface

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Responsive design for tablet and mobile

## Key Implementation Details

1. **No Backend**: All data is client-side only using React state
2. **TypeScript**: Full type safety with comprehensive interface definitions
3. **Tailwind CSS**: Utility-first styling with custom design tokens
4. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
5. **Form Validation**: Client-side validation with clear error messages
6. **Mock Data**: Realistic mock data for demonstration purposes
7. **QR Codes**: Generated using qrcode library
8. **Responsive**: Mobile-first design with tablet and desktop layouts
9. **Performance**: Minimal re-renders, efficient state updates
10. **Scalability**: Component-based architecture for easy extension

## Future Enhancements

- Backend API integration
- Real database connections
- User authentication and RBAC
- Real warehouse location data from warehouse management system
- Integration with vehicle management systems
- Email notifications for approvals
- Advanced discrepancy analytics
- Historical workflow tracking
- Batch operations for multiple items
- Barcode/QR code scanning
- Real-time updates for concurrent operations
