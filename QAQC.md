# 🛠️ BatchEditor Widget for ArcGIS Experience Builder

This custom widget allows users to:
1. Draw a **rectangle or polygon** to select features on the map.
2. **Batch-edit a field** (e.g., Status) on all selected features.

---

## 💡 Core Functionality

| Feature                 | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| Map Sketching Tool     | Draws geometry using `Sketch` widget to select features                    |
| Feature Selection      | Queries all features that intersect the drawn shape                        |
| Field Update Panel     | Lets user define which field to update and the new value                   |
| Batch Editing Function | Applies edits to all selected features using `applyEdits()`                |
| Async State Management | Provides loading feedback and error messages during operations             |

---

## 🧠 State Variables

| Variable     | Type    | Purpose                                                   |
|--------------|---------|-----------------------------------------------------------|
| `layerUrl`   | string  | Feature service layer URL to update                       |
| `fieldName`  | string  | Name of the field to edit                                 |
| `newValue`   | string  | Value to apply to the selected features                   |
| `features`   | array   | Holds selected features after geometry query              |
| `loading`    | boolean | Controls spinner during queries or edits                  |
| `error`      | string  | Displays error messages in UI                             |

---

## 🧱 Component Structure

```jsx
<JimuMapViewComponent
  useMapWidgetId={this.props.useMapWidgetIds[0]}
  onActiveViewChange={this.onMapReady}
/>
