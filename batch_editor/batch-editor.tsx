/** 
 * BatchEditor widget for ArcGIS Experience Builder
 *
 * Allows you to:
 *   1. Draw a rectangle/polygon on the map to select features.
 *   2. Batch-edit a single field on those selected features.
 *
 * State variables:
 *   - layerUrl (string): URL to your Feature Service layer.
 *   - fieldName (string): The name of the field to update.
 *   - newValue (string): The new value to write.
 *   - features (array): Selected features to be updated.
 *   - loading (bool): Flag for async operations.
 *   - error (string): Any error message to display.
 */

import { React } from 'jimu-core'; // Importing React from jimu-core
import { JimuMapViewComponent } from 'jimu-arcgis'; // Importing the JimuMapViewComponent for interacting with the map view
import { Button, Input, Spinner } from 'jimu-ui'; // Importing UI components from jimu-ui

import FeatureLayer from '@arcgis/core/layers/FeatureLayer'; // Importing the FeatureLayer for querying and editing features
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'; // Importing the GraphicsLayer for drawing geometries
import Sketch from '@arcgis/core/widgets/Sketch'; // Importing Sketch widget for user drawings
import Query from '@arcgis/core/rest/support/Query'; // Importing Query support to select features

export default class BatchEditor extends React.PureComponent { // Declaring a class component that extends React.PureComponent
  constructor(props) { // Constructor to initialize the component with props
    super(props); // Calling the parent class constructor
    this.state = { // Initial state of the component
      layerUrl: '', // URL to the feature service
      fieldName: '', // Name of the field to be edited
      newValue: '', // New value to apply to the field
      features: [], // Features selected on the map
      loading: false, // Flag to indicate whether data is loading
      error: '' // Error message string
    };
    this.view = null; // Map view instance
    this.graphicsLayer = null; // Graphics layer to show user drawings
    this.sketch = null; // Sketch widget instance
    this.client = null; // FeatureLayer client
  }

  onMapReady = view => { // Function called when map view becomes available
    this.view = view; // Store map view
    this.graphicsLayer = new GraphicsLayer(); // Create a new graphics layer
    view.map.add(this.graphicsLayer); // Add the graphics layer to the map

    this.sketch = new Sketch({ // Initialize sketch widget
      view: view, // Set the map view
      layer: this.graphicsLayer, // Layer to draw geometries
      creationMode: 'single' // Allow only one shape at a time
    });

    this.sketch.on('create', async evt => { // Listen for create event from sketch
      if (evt.state === 'complete') { // When drawing is completed
        await this.querySelection(evt.graphic.geometry); // Query features using drawn geometry
      }
    });
  }

  querySelection = async geometry => { // Function to query features based on geometry
    const { layerUrl, fieldName } = this.state; // Destructure layerUrl and fieldName from state
    if (!layerUrl || !fieldName) { // If either value is missing
      this.setState({ error: 'Enter both Layer URL and Field Name.' }); // Show error
      return; // Stop execution
    }

    this.setState({ loading: true, error: '' }); // Set loading to true and clear previous errors

    if (!this.client || this.client.url !== layerUrl) { // Create new client if needed
      this.client = new FeatureLayer({ url: layerUrl }); // Initialize FeatureLayer
    }

    try {
      const query = new Query({ // Create a new Query object
        geometry: geometry, // Set the geometry for the query
        spatialRelationship: 'intersects', // Query for features intersecting the geometry
        outFields: ['OBJECTID', fieldName], // Fields to return
        returnGeometry: false // Do not return geometry in the result
      });
      const result = await this.client.queryFeatures(query); // Execute the query
      this.setState({ features: result.features, loading: false }); // Store results in state and stop loading
    } catch (err) {
      this.setState({ error: err.message, loading: false }); // Catch and display any error
    }
  }

  applyEdits = async () => { // Function to apply edits to selected features
    const { features, newValue, fieldName } = this.state; // Destructure relevant state variables
    if (!features.length || !newValue) return; // Exit if no features or value

    this.setState({ loading: true, error: '' }); // Set loading state and clear error
    try {
      const updates = features.map(f => ({ // Map over features to build update array
        attributes: {
          OBJECTID: f.attributes.OBJECTID, // Required ID field
          [fieldName]: newValue // Updated value for specified field
        }
      }));
      const res = await this.client.applyEdits({ updates }); // Call applyEdits with updates
      console.log('Edits result:', res); // Log result to console
      this.graphicsLayer.removeAll(); // Clear drawn shapes from the map
      this.setState({ features: [], newValue: '', loading: false }); // Reset state
    } catch (err) {
      this.setState({ error: err.message, loading: false }); // Show any errors
    }
  }

  render() { // Render the component UI
    const { layerUrl, fieldName, newValue, features, loading, error } = this.state; // Destructure state variables

    return ( // Return the JSX output
      <div style={{ padding: 12 }}> // Container div with padding
        <h3>Batch Field Editor</h3> // Header

        <label>Feature Service URL:</label> // Label for input
        <Input
          value={layerUrl} // Input value from state
          onChange={e => this.setState({ layerUrl: e.target.value })} // Update layerUrl in state
          placeholder="https://…/FeatureServer/0" // Placeholder text
        />

        <label>Field Name:</label> // Label for input
        <Input
          value={fieldName} // Input value from state
          onChange={e => this.setState({ fieldName: e.target.value })} // Update fieldName in state
          placeholder="e.g., Status" // Placeholder text
        />

        <p>Draw a box or polygon on the map to select features:</p> // Instruction
        <JimuMapViewComponent
          useMapWidgetId={this.props.useMapWidgetIds[0]} // Pass map widget ID
          onActiveViewChange={this.onMapReady} // Event handler when map view is ready
        />

        {loading && <Spinner size="small" />} // Show loading spinner if needed

        {features.length > 0 && ( // If features are selected
          <>
            <p>{features.length} features selected.</p> // Show count of selected features

            <label>New Value:</label> // Label for input
            <Input
              value={newValue} // Input value from state
              onChange={e => this.setState({ newValue: e.target.value })} // Update newValue in state
            />

            <Button
              onClick={this.applyEdits} // Button triggers applyEdits
              disabled={!newValue || loading} // Disable if invalid
              style={{ marginTop: 8 }} // Add margin
            >
              Apply to All
            </Button>
          </>
        )}

        {error && ( // Show error if exists
          <div style={{ color: 'red', marginTop: 8 }}>{error}</div> // Render error message
        )}
      </div>
    );
  }
}
