
# 🧰 BatchEditor Widget for ArcGIS Experience Builder

The `BatchEditor` widget allows users to select multiple features on a map using a sketch tool and apply batch edits to a specified field. Built for ArcGIS Experience Builder using Esri's JavaScript and React libraries.

---

## 🚀 Features

| Feature                 | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| Map Sketch Tool        | Users can draw rectangles or polygons to select features                   |
| Feature Selection      | Queries features intersecting drawn geometry using `FeatureLayer.queryFeatures()` |
| Field Input            | Accepts a field name and new value for batch editing                        |
| Batch Apply Edits      | Uses `applyEdits()` to update multiple features at once                     |
| Loading/Error States   | Shows spinner and messages during API calls or failures                     |

---

## 🧠 State Variables

| Variable     | Type    | Description                                        |
|--------------|---------|----------------------------------------------------|
| `layerUrl`   | string  | URL of the feature layer to edit                   |
| `fieldName`  | string  | Field to update across selected features           |
| `newValue`   | string  | Value to set in the specified field                |
| `features`   | array   | Features returned by query                         |
| `loading`    | boolean | Spinner visibility during async operations         |
| `error`      | string  | Error messages displayed in the UI                 |

---

## 🔧 Widget Architecture

### `onMapReady(view)`
- Initializes the Sketch widget
- Adds a `GraphicsLayer` to the map for visual feedback

### `querySelection(geometry)`
- Takes geometry from the sketch tool
- Queries features in the given geometry with `.queryFeatures()`
- Populates the `features` state array

### `applyEdits()`
- Iterates through selected features
- Applies a batch update to the chosen field via `applyEdits()`

---

## 📦 Dependencies

- `@arcgis/core/layers/FeatureLayer`
- `@arcgis/core/widgets/Sketch`
- `@arcgis/core/rest/support/Query`
- `GraphicsLayer` from `@arcgis/core/layers`
- UI: `jimu-core`, `jimu-ui`, `jimu-arcgis`

---

## 🧪 Usage Example

Once integrated into your Experience Builder app:

1. Paste a feature layer URL.
2. Enter the name of the field to edit.
3. Draw a shape on the map.
4. Type a new value.
5. Click “Apply to All” to batch update.

---

## 💡 Notes

- The Sketch tool only draws one shape at a time (`creationMode: 'single'`).
- The system assumes `OBJECTID` is used for identifying records.
- Error messages and edge cases are managed via `try/catch` blocks and component state.

---

## 🖼️ Suggested UI Preview

```html
<h3>🖼️ Figure: BatchEditor Widget UI Layout</h3>

<img src="your_screenshot.png" alt="BatchEditor Interface" width="600"/>

<p>
This figure shows the layout of the widget, including input fields, a map canvas for drawing, 
and buttons for applying edits to selected features.
</p>
```

---

## 🧠 Use This When...

- You want to enable **bulk updates** on a hosted feature layer from a front-end UI.
- You're building a **field editing tool** in Experience Builder with user-drawn geometry.
- You need to avoid individual record edits and streamline spatial QA fixes.

---

## 📂 Future Enhancements

- Support for multiple field updates
- Editable attribute preview before applying
- Undo/rollback functionality

---

**Author**: Custom implementation for Esri Experience Builder  
**License**: MIT or Esri AppStudio-compatible
