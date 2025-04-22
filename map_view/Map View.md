
# 🗺️ `MapView.tsx`

A reusable React class component that renders a Mapbox GL map using `react-map-gl`.  
This component is designed for **Next.js** apps and provides a clean interface for viewing and tracking location changes.

---

## 🌍 Core Features

| Feature               | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| Initial Viewport     | Renders a map centered on given latitude/longitude props                   |
| Marker Support       | Adds a custom marker at the location                                        |
| Viewport Callback    | Optional callback on map move events (`onViewportChange`)                   |
| Token Management     | Pulls token from `.env` and logs errors if missing                          |
| Error Logging        | Uses a custom `Logger` utility for handling map and runtime issues          |

---

## ⚙️ Required Environment Variable

| Variable                          | Description                                    |
|----------------------------------|------------------------------------------------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Your public Mapbox token from `.env.local`     |

> Missing token is caught and logged using the shared `Logger`.

---

## 🔧 Props

```ts
interface MapViewProps {
  latitude: number;
  longitude: number;
  onViewportChange?: (viewport: ViewState) => void;
}
```

---

## 💾 Internal State

```ts
interface MapViewState {
  viewport: ViewState;
  mapboxToken: string;
}
```

- `viewport`: Tracks map center, zoom, pitch, bearing.
- `mapboxToken`: Read once from environment on component initialization.

---

## 🔁 Lifecycle Hooks

| Method            | Purpose                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `componentDidMount()` | Logs token warning if undefined                                      |
| `componentDidUpdate()` | Updates map viewport if props change                               |

---

## 🚀 Key Behaviors

### Map Initialization

```tsx
<ReactMapGL
  {...viewport}
  mapStyle="mapbox://styles/mapbox/light-v10"
  mapboxAccessToken={mapboxToken}
  onMove={this.handleMove}
  onError={this.handleMapError}
/>
```

- Injects navigation controls
- Handles viewport tracking
- Places a custom red marker using `<Marker />`

---

## 🧠 Error Handling

### Missing Token

Displays a fallback message in the component if the token is not set.

```jsx
if (!mapboxToken) {
  return (
    <div style={{ color: 'red' }}>
      Error: Mapbox access token is not provided.
    </div>
  );
}
```

---

## 📦 Dependencies

- `react-map-gl`
- `mapbox-gl` (CSS)
- `Logger` (custom utility for error logging)

Install via:

```bash
npm install react-map-gl mapbox-gl
```

---

## 🧠 Use This When...

- You need a **self-contained map component** for location-based React apps
- You want to **track and emit viewport changes**
- You're building **Next.js** tools that show real-time or dynamic map views

---

**Author**: Component designed for Mapbox apps using React + TypeScript  
**Status**: Production-ready with token and error handling
