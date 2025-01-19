// Function to get user's current location
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
	return new Promise((resolve, reject) => {
	  if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	  } else {
		reject(new Error('Geolocation is not supported by this browser.'));
	  }
	});
  };