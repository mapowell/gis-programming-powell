/** 
 * BatchEditor widget for ArcGIS Experience Builder
 *
 * Allows you to:
 *   1. Draw a rectangle/polygon on the map to select features.
 *   2. Batch‐edit a single field on those selected features.
 *
 * State variables:
 *   - layerUrl (string): URL to your Feature Service layer.
 *   - fieldName (string): The name of the field to update.
 *   - newValue (string): The new value to write.
 *   - features (array): Selected features to be updated.
 *   - loading (bool): Flag for async operations.
 *   - error (string): Any error message to display.
 */

import { React } from 'jimu-core';
import { JimuMapViewComponent } from 'jimu-arcgis';
import { Button, Input, Spinner } from 'jimu-ui';

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Sketch from '@arcgis/core/widgets/Sketch';
import Query from '@arcgis/core/rest/support/Query';

export default class BatchEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      layerUrl: '',
      fieldName: '',
      newValue: '',
      features: [],
      loading: false,
      error: ''
    };
    this.view = null;
    this.graphicsLayer = null;
    this.sketch = null;
    this.client = null;
  }

  // Initialize selection tools once the map view is ready
  onMapReady = view => {
    this.view = view;
    // GraphicsLayer to show selection geometry
    this.graphicsLayer = new GraphicsLayer();
    view.map.add(this.graphicsLayer);

    // Sketch widget for drawing selection shapes
    this.sketch = new Sketch({
      view: view,
      layer: this.graphicsLayer,
      creationMode: 'single'
    });

    // When drawing is complete, query features
    this.sketch.on('create', async evt => {
      if (evt.state === 'complete') {
        await this.querySelection(evt.graphic.geometry);
      }
    });
  }

  // Query features by the drawn geometry
  querySelection = async geometry => {
    const { layerUrl, fieldName } = this.state;
    if (!layerUrl || !fieldName) {
      this.setState({ error: 'Enter both Layer URL and Field Name.' });
      return;
    }

    this.setState({ loading: true, error: '' });
    // Create a new client if URL changed
    if (!this.client || this.client.url !== layerUrl) {
      this.client = new FeatureLayer({ url: layerUrl });
    }

    try {
      const query = new Query({
        geometry: geometry,
        spatialRelationship: 'intersects',
        outFields: ['OBJECTID', fieldName],
        returnGeometry: false
      });
      const result = await this.client.queryFeatures(query);
      this.setState({ features: result.features, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  // Apply batch edits to the selected features
  applyEdits = async () => {
    const { features, newValue, fieldName } = this.state;
    if (!features.length || !newValue) return;

    this.setState({ loading: true, error: '' });
    try {
      const updates = features.map(f => ({
        attributes: {
          OBJECTID: f.attributes.OBJECTID,
          [fieldName]: newValue
        }
      }));
      const res = await this.client.applyEdits({ updates });
      console.log('Edits result:', res);
      // Clear selection
      this.graphicsLayer.removeAll();
      this.setState({ features: [], newValue: '', loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  render() {
    const { layerUrl, fieldName, newValue, features, loading, error } = this.state;

    return (
      <div style={{ padding: 12 }}>
        <h3>Batch Field Editor</h3>

        <label>Feature Service URL:</label>
        <Input
          value={layerUrl}
          onChange={e => this.setState({ layerUrl: e.target.value })}
          placeholder="https://…/FeatureServer/0"
        />

        <label>Field Name:</label>
        <Input
          value={fieldName}
          onChange={e => this.setState({ fieldName: e.target.value })}
          placeholder="e.g., Status"
        />

        <p>Draw a box or polygon on the map to select features:</p>
        <JimuMapViewComponent
          useMapWidgetId={this.props.useMapWidgetIds[0]}
          onActiveViewChange={this.onMapReady}
        />

        {loading && <Spinner size="small" />}

        {features.length > 0 && (
          <>
            <p>{features.length} features selected.</p>

            <label>New Value:</label>
            <Input
              value={newValue}
              onChange={e => this.setState({ newValue: e.target.value })}
            />

            <Button
              onClick={this.applyEdits}
              disabled={!newValue || loading}
              style={{ marginTop: 8 }}
            >
              Apply to All
            </Button>
          </>
        )}

        {error && (
          <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
        )}
      </div>
    );
  }
}
