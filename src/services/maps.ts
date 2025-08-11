// Mock Google Maps service for development

interface MapOptions {
  center: { lat: number; lng: number };
  zoom: number;
}

interface MockMap {
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  getCenter: () => { lat: number; lng: number };
  getZoom: () => number;
}

interface MockMarker {
  setPosition: (position: { lat: number; lng: number }) => void;
  setTitle: (title: string) => void;
  setMap: (map: MockMap | null) => void;
}

export const loadMap = async (mapContainer: HTMLElement, options: MapOptions): Promise<MockMap> => {
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock map div
  const mockMapDiv = document.createElement('div');
  mockMapDiv.style.width = '100%';
  mockMapDiv.style.height = '100%';
  mockMapDiv.style.backgroundColor = '#e5e7eb';
  mockMapDiv.style.display = 'flex';
  mockMapDiv.style.alignItems = 'center';
  mockMapDiv.style.justifyContent = 'center';
  mockMapDiv.style.color = '#6b7280';
  mockMapDiv.style.fontSize = '14px';
  mockMapDiv.innerHTML = `
    <div style="text-align: center;">
      <div style="margin-bottom: 8px;">🗺️</div>
      <div>Google Maps Preview</div>
      <div style="font-size: 12px; opacity: 0.7;">Lat: ${options.center.lat.toFixed(4)}, Lng: ${options.center.lng.toFixed(4)}</div>
      <div style="font-size: 12px; opacity: 0.7;">Zoom: ${options.zoom}</div>
    </div>
  `;
  
  mapContainer.appendChild(mockMapDiv);
  
  return {
    setCenter: (center) => {
      const coordDiv = mockMapDiv.querySelector('div:nth-child(3)') as HTMLElement;
      if (coordDiv) {
        coordDiv.textContent = `Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}`;
      }
    },
    setZoom: (zoom) => {
      const zoomDiv = mockMapDiv.querySelector('div:nth-child(4)') as HTMLElement;
      if (zoomDiv) {
        zoomDiv.textContent = `Zoom: ${zoom}`;
      }
    },
    getCenter: () => options.center,
    getZoom: () => options.zoom
  };
};

export const createMarker = (map: MockMap, position: { lat: number; lng: number }, title: string): MockMarker => {
  return {
    setPosition: (newPosition) => {
      console.log(`Marker moved to: ${newPosition.lat}, ${newPosition.lng}`);
    },
    setTitle: (newTitle) => {
      console.log(`Marker title changed to: ${newTitle}`);
    },
    setMap: (newMap) => {
      console.log(`Marker ${newMap ? 'added to' : 'removed from'} map`);
    }
  };
};

export const getDirections = (
  origin: { lat: number; lng: number }, 
  destination: { lat: number; lng: number }, 
  callback: (directions: any) => void
): void => {
  // Simulate directions API call
  setTimeout(() => {
    const mockDirections = {
      routes: [{
        legs: [{
          distance: { text: '5.2 km', value: 5200 },
          duration: { text: '12 mins', value: 720 },
          start_address: `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}`,
          end_address: `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`
        }]
      }]
    };
    
    callback(mockDirections);
  }, 1000);
};