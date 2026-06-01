# Rocket Elevators Operations Dashboard Specification

## Objective

Create a static internal operations dashboard for Rocket Elevators that reads elevator license data and provides real-time insights to operations managers.

---

## Data Source

- File: `data/elevator_licenses.csv`
- Format: CSV with headers
- Key columns: ElevatingDevicesNumber, LocationoftheElevatingDevice, LICENSESTATUS, LICENSEEXPIRYDATE

---

### Sidebar Navigation

Left sidebar with navigation items:

- Dashboard (active by default)
- Elevators
- Inspections
- Reports

Sidebar width: 250px, Fixed position

---

## Summary Cards Section

Three summary cards at the top of the page:

1. **Total Elevators**
   - Count all rows in CSV
   - Display as large number
   - Icon: 🏢

2. **Active Elevators**
   - Count rows where LICENSESTATUS = "ACTIVE"
   - Display as large number
   - Icon: ✅

3. **Expired Licenses**
   - Count rows where LICENSEEXPIRYDATE < TODAY
   - Display as large number
   - Color: Red/Warning
   - Icon: ⚠️

---

## Data Table

Searchable table with columns:

- Elevator ID (ElevatingDevicesNumber)
- Location (LocationoftheElevatingDevice)
- License Number (ElevatingDevicesLicenseNumber)
- Status (LICENSESTATUS)
- License Expiry (LICENSEEXPIRYDATE)
- License Holder (LICENSEHOLDER)

Search functionality: Filter table in real-time by any column

---

## Design Requirements

### Color Palette

- Primary Blue: #2563eb
- Dark Blue: #1e40af
- Success Green: #10b981
- Warning Red: #ef4444
- Background: #f9fafb
- Text Dark: #1f2937
- Border: #e5e7eb

### Typography

- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Base Font Size: 14px
- Heading Sizes: H1=32px, H2=24px, H3=18px

### Layout

- Sidebar: 250px fixed
- Main content: Remaining space with 20px padding
- Card gap: 16px
- Table row height: 48px
- Responsive: Works on desktop (mobile not required)

### Style

- Clean, modern interface
- Corporate appearance
- High contrast for readability
- Subtle shadows and borders
- Hover effects on interactive elements

---

## Technical Requirements

- **Language**: HTML5 + CSS3 + Vanilla JavaScript
- **No Frameworks**: No React, Vue, Angular
- **No Build Tools**: No webpack, npm scripts
- **CSV Parsing**: Use native JavaScript (or Papa Parse if needed)
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

---
