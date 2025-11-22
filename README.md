# ParkShare - Parking Spot Sharing App

A demo app for sharing parking spots, built for a hackathon. Users can search for available parking spots, view them on a map, and make reservations.

## Features

- **4 Screen Flow:**
  - Search: Enter location and time to find parking
  - Map View: See available spots on Google Maps with pricing
  - Spot Details: View detailed information about a parking spot
  - Confirm Booking: Review and confirm your reservation

- **Tech Stack:**
  - Next.js 16 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Google Maps API
  - Mock data (no backend required)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google Maps API:**
   - Get an API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Enable the "Maps JavaScript API" and "Places API"
   - Copy `.env.local` and add your API key:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app:**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Start on the Search screen
2. Enter a location (e.g., "Memorial Union")
3. Adjust the date/time if needed
4. Click "Search" to see available spots on the map
5. Click on a spot card to view details
6. Click "Reserve spot" to proceed to confirmation
7. Review and confirm your booking

## Demo Data

The app includes 5 mock parking spots near the UW-Madison campus:
- Private driveway near Memorial Union
- Campus garage spot
- Street parking on State St
- Private lot behind apartment
- Covered garage near library

All data is hardcoded in `lib/mockData.ts` for demo purposes.

## Project Structure

```
app/
├── page.tsx              # Screen 1: Search
├── map/page.tsx          # Screen 2: Map + Results
├── spot/[id]/page.tsx    # Screen 3: Spot Details
└── confirm/page.tsx      # Screen 4: Review & Confirm

lib/
├── types.ts              # TypeScript interfaces
├── mockData.ts           # Mock parking spots
└── context/
    └── AppContext.tsx    # Global state management

components/ui/            # shadcn components
```

## Notes

- This is a demo app built for a hackathon
- No real payment processing
- No backend or database
- Mock data only
- Google Maps API key required for map functionality
