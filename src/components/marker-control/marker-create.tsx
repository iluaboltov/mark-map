import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import {useEffect, useState} from 'react';

export function useDrawingManager(
  initialValue: google.maps.drawing.DrawingManager | null = null
) {
  const map = useMap();
  const drawing = useMapsLibrary('drawing');

  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(initialValue);

  useEffect(() => {
    if (!map || !drawing) return;

    // https://developers.google.com/maps/documentation/javascript/reference/drawing
    const newDrawingManager = new drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
        ],
        position: google.maps.ControlPosition.TOP_CENTER
      },
      drawingMode: google.maps.drawing.OverlayType.CIRCLE,
      map,
      markerOptions: {
        draggable: true
      },
    });

    setDrawingManager(newDrawingManager);

    return () => {
      newDrawingManager.setMap(null);
    };
  }, [drawing, map]);

  return drawingManager;
}
