"use client";

/**
 * MapView.tsx
 * ---------------------------------------------
 * A reusable React class component that renders a Mapbox GL map using `react-map-gl`.
 * 
 * This component:
 * - Initializes the map view based on latitude and longitude props
 * - Renders a marker at the specified location
 * - Calls an optional callback when the user changes the viewport
 * - Handles missing Mapbox tokens and logs errors through a shared Logger utility
 * 
 * Environment:
 * - Requires a Mapbox access token set as NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in the .env file
 * 
 * Dependencies:
 * - react-map-gl
 * - mapbox-gl (CSS)
 * - A custom Logger utility
 * 
 * This component is intended for use in client-side rendering contexts with Next.js.
 */

import React from "react";
import ReactMapGL, { Marker, NavigationControl, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Logger from "../utils/logger";

// Define error event type for map errors
interface MapErrorEvent {
  error?: Error;
  status?: number;
  message?: string;
}

interface MapViewProps {
  latitude: number;
  longitude: number;
  onViewportChange?: (viewport: ViewState) => void;
}

interface MapViewState {
  viewport: ViewState;
  mapboxToken: string;
}

class MapView extends React.Component<MapViewProps, MapViewState> {
  /**
   * Initializes the component with initial viewport and Mapbox token.
   */
  constructor(props: MapViewProps) {
    super(props);

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    this.state = {
      viewport: {
        longitude: props.longitude,
        latitude: props.latitude,
        zoom: 10,
        pitch: 0,
        bearing: 0,
      },
      mapboxToken,
    };
  }

  /**
   * Warns about missing token after component mounts.
   */
  componentDidMount() {
    this.logMissingToken();
  }

  /**
   * Updates the viewport if the latitude or longitude props change.
   */
  componentDidUpdate(prevProps: MapViewProps) {
    const { latitude, longitude, onViewportChange } = this.props;
    if (latitude !== prevProps.latitude || longitude !== prevProps.longitude) {
      try {
        const updatedViewport = {
          ...this.state.viewport,
          latitude,
          longitude,
        };
        this.setState({ viewport: updatedViewport });
        if (onViewportChange) onViewportChange(updatedViewport);
      } catch (error) {
        Logger.error("Error updating viewport in componentDidUpdate:", error);
      }
    }
  }

  /**
   * Logs an error if the Mapbox access token is missing.
   */
  logMissingToken() {
    if (!this.state.mapboxToken) {
      const error = new Error("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set in your .env file.");
      Logger.error(
        "Mapbox access token is missing. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file.",
        error
      );
    }
  }

  /**
   * Handles user-initiated map movement by updating local state and notifying the parent.
   */
  handleMove = (evt: { viewState: ViewState }) => {
    const { onViewportChange } = this.props;
    try {
      this.setState({ viewport: evt.viewState });
      if (onViewportChange) onViewportChange(evt.viewState);
    } catch (error) {
      Logger.error("Error handling map move event:", error);
    }
  };

  /**
   * Logs any map-related errors triggered by the ReactMapGL component.
   */
  handleMapError = (evt: MapErrorEvent) => {
    Logger.error("ReactMapGL encountered an error:", evt.error || evt);
  };

  /**
   * Renders the map container and interactive map UI.
   * If the Mapbox token is missing, displays an error message.
   */
  render() {
    const { latitude, longitude } = this.props;
    const { viewport, mapboxToken } = this.state;

    if (!mapboxToken) {
      return (
        <div style={{ color: "red", padding: "1rem" }}>
          Error: Mapbox access token is not provided.<br />
          Please set <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> in your <code>.env</code> file.
        </div>
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          margin: 0,
          padding: 0,
        }}
      >
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
          <ReactMapGL
            {...viewport}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v10"
            mapboxAccessToken={mapboxToken}
            onMove={this.handleMove}
            onError={this.handleMapError}
          >
            {/* Marker for provided location */}
            {Number.isFinite(latitude) && Number.isFinite(longitude) && (
              <Marker longitude={longitude} latitude={latitude} offset={[-20, -10]}>
                <div
                  style={{
                    fontSize: "2rem",
                    color: "red",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  ●
                </div>
              </Marker>
            )}

            {/* Zoom and pan controls */}
            <NavigationControl />
          </ReactMapGL>
        </div>
      </div>
    );
  }
}

export default MapView;
