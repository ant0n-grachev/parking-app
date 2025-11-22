# ParkShare - Parking Spot Sharing App

A demo app for sharing parking spots, built for a hackathon. Users can search for available parking spots, view them on a map, and make reservations.

## Features

- **Mobile-First Design:**
  - Max-width 448px (md breakpoint) for mobile-optimized experience
  - Centered on desktop screens

- **3 Screen Flow:**
  - Home/Map: See available spots on Google Maps with search bar on top
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

1. Start on the Home/Map screen showing all available spots
2. Click the search bar at the top to filter by location and time
3. Enter a location (e.g., "Memorial Union")
4. Adjust the date/time if needed
5. Click "Search" to filter spots on the map
6. Click on a spot card in the bottom carousel to view details
7. Click "Reserve spot" to proceed to confirmation
8. Review and confirm your booking

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
├── page.tsx              # Home: Map + Search (merged)
├── spot/[id]/page.tsx    # Spot Details
└── confirm/page.tsx      # Review & Confirm

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
