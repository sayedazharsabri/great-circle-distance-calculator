interface IGreatCircleDistance {
  radius: number;
  fromLocation: ICoordinates;
  setFromLocation(latitude: number, longitude: number): void;
  degreeToRadian(coordinate: number): number;
  getDistanceToLocationInKM(latitude: number, longitude: number): number;
  isValidLatitude(latitude: number): boolean;
  isValidLongitude(latitude: number): boolean;
}

interface ICoordinates {
  latitude: number;
  longitude: number;
}

const InvalidLatitude: Error = new Error(
  "Invalid Latitude, Latitude should be in between -90 and 90!"
);
const InvalidLongitude: Error = new Error(
  "Invalid Longitude, Longitude should be in between -180 and 180!"
);

class GreatCircleDistance implements IGreatCircleDistance {
  radius: number;

  fromLocation: ICoordinates = { latitude: 0.0, longitude: 0.0 };
  constructor(radius: number = 6371) {
    /**
     * - Enter radius in kilometers, default is Earth's radius
     */
    this.radius = radius;
  }

  setFromLocation(
    latitude: number = 28.5272803,
    longitude: number = 77.0688994
  ): void {
    /**
     * - This function will be set fromLocation's coordinates in Radian
     * - Function will throw InvalidLatitude or InvalidLongitude exception in case of
     * invalid value of latitude or longitude
     * - Default latitude and longitude are of New Delhi, India
     */
    if (!this.isValidLatitude(latitude)) {
      throw InvalidLatitude;
    }

    if (!this.isValidLongitude(longitude)) {
      throw InvalidLongitude;
    }
    this.fromLocation.latitude = this.degreeToRadian(latitude);
    this.fromLocation.longitude = this.degreeToRadian(longitude);
  }

  isValidLatitude(latitude: number): boolean {
    /**
     * This function will return true if, Latitude is valid, otherwise it will return false
     */
    if (latitude > -90 && latitude < 90) {
      return true;
    }
    return false;
  }

  isValidLongitude(longitude: number): boolean {
    /**
     * This function will return true if, Longitude is valid, otherwise it will return false
     */
    if (longitude > -180 && longitude < 180) {
      return true;
    }
    return false;
  }

  degreeToRadian(coordinate: number): number {
    /**
     * - This function will convert coordinate in degree to radian
     */
    return (coordinate * Math.PI) / 180;
  }

  getDistanceToLocationInKM(
    latitude: number = 28.5272803,
    longitude: number = 77.0688994
  ): number {
    /**
     * - This function will return the distance in Kilometer
     * - Formula of Great Circle Distance: d = rcos-1[cos a cos b cos(x-y) + sin a sin b]
     * - Function will through InvalidLatitude or InvalidLogitude exception in case of
     * invalid value of latitude or longitude
     * - Default latitude and longitude are of New Delhi, India
     */

    if (!this.isValidLatitude(latitude)) {
      throw InvalidLatitude;
    }

    if (!this.isValidLongitude(longitude)) {
      throw InvalidLongitude;
    }

    const latitudeInRadian = this.degreeToRadian(latitude);
    const longitudeInRadian = this.degreeToRadian(longitude);

    const centralAngle: number = this.getCentralAngle(
      latitudeInRadian,
      longitudeInRadian
    );
    const distance: number = this.radius * centralAngle;
    return Math.round(distance * 100) / 100;
  }

  getCentralAngle(lat1: number, long1: number): number {
    /**
     * - This function will return the central angle
     */
    const diffLongitudes = Math.abs(this.fromLocation.longitude - long1);
    const centralAngle = Math.acos(
      Math.sin(lat1) * Math.sin(this.fromLocation.latitude) +
        Math.cos(lat1) *
          Math.cos(this.fromLocation.latitude) *
          Math.cos(diffLongitudes)
    );
    return centralAngle;
  }
}

export = GreatCircleDistance;
