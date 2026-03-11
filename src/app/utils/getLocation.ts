import mapboxgl from "mapbox-gl";

const getLocation = (): Promise<{ coordinates: [number, number] | null; address: string | null }> => {

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        const options = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 } as const;

        let resolved = false;
        let bestPosition: GeolocationPosition | null = null;
        let timerId: number | undefined;

        const finish = (pos: GeolocationPosition | null) => {
          if (resolved) return;
          resolved = true;
          if (watchId !== null) navigator.geolocation.clearWatch(watchId);
          if (timerId) clearTimeout(timerId);

          if (!pos) {
            resolve({ coordinates: null, address: null });
            return;
          }

          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const coordinates: [number, number] = [lon, lat];
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${mapboxgl.accessToken}`)
            .then((response) => response.json())
            .then((data) => {
              const address = data.features[0]?.place_name || null;
              resolve({ coordinates, address });
            })
            .catch((error) => {
              console.error("Error fetching address:", error);
              resolve({ coordinates, address: null });
            });
        };

        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
              bestPosition = position;
            }
            // If we have a high-precision fix, finish immediately
            if (position.coords.accuracy <= 30) {
              finish(position);
            }
          },
          (error) => {
            console.error(error);
            // If we already have a best reading, use it; else fail
            finish(bestPosition);
          },
          options
        );

        // Hard stop after 12s: use best reading if available
        timerId = setTimeout(() => finish(bestPosition), 12000) as unknown as number;
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve({ coordinates: null, address: null });
      }
    });
  };
  
  export default getLocation;
  