---
"@zoom-image/core": minor
---

Expose a `maxWheelDelta` option on `createZoomImageWheel` to configure how far a single wheel event zooms

The wheel delta was previously clamped to a hardcoded `0.5`. That value is now the default of the new `maxWheelDelta`
option, so consumers can slow zooming down or speed it up to suit their input devices.
