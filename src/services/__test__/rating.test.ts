// Models
import { Beach, GeoPosition } from '@src/models/beach';

// Services
import { Rating } from '@src/services/rating';

describe('Rating Service', () => {
  const defaultBeach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: GeoPosition.E,
    user: 'some-user',
  };

  const defaultRating = new Rating(defaultBeach);

  describe('Calculate rating for a given point', () => {
    const defaultPoint = {
      swellDirection: 110,
      swellHeight: 0.1,
      swellPeriod: 5,
      time: 'test',
      waveDirection: 110,
      waveHeight: 0.1,
      windDirection: 100,
      windSpeed: 100,
    };

    it('should get a rating less than 1 for a poor point', () => {
      const rating = defaultRating.getRateForPoint(defaultPoint);
      expect(rating).toBe(1);
    });

    it('should get a rating of 1 for an ok point', () => {
      const rating = defaultRating.getRateForPoint({ ...defaultPoint, swellHeight: 0.4 });
      expect(rating).toBe(1);
    });

    it('should get a rating of 3 for a point with offshore winds and a half overhead height', () => {
      const rating = defaultRating.getRateForPoint({ ...defaultPoint, swellHeight: 0.7, windDirection: 250 });
      expect(rating).toBe(3);
    });

    it('should get a rating of 5 for an epic point', () => {
      const rating = defaultRating.getRateForPoint({ ...defaultPoint, swellHeight: 2.5, swellPeriod: 20, windDirection: 250 });
      expect(rating).toBe(5);
    });
  });

  /**
   * Wind and wave position specific ligic calculation
   */
  describe('Get rating based on wind and wave position', () => {
    it('should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePosition(GeoPosition.E, GeoPosition.E);
      expect(rating).toBe(1);
    });

    it('should get rating 3 for a beach with cross winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePosition(GeoPosition.E, GeoPosition.S);
      expect(rating).toBe(3);
    });

    it('should get rating 5 for a beach with offshore winds', () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePosition(GeoPosition.E, GeoPosition.W);
      expect(rating).toBe(5);
    });
  });

  /**
   * Swell period specific ligic calculation
   */
  describe('Get rating based on swell period', () => {
    it('should get a rating of 1 for a period of 5 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(5);
      expect(rating).toBe(1);
    });

    it('should get a rating of 2 for a period of 9 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(9);
      expect(rating).toBe(2);
    });

    it('should get a rating of 4 for a period of 12 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(12);
      expect(rating).toBe(4);
    });

    it('should get a rating of 5 for a period of 16 seconds', () => {
      const rating = defaultRating.getRatingForSwellPeriod(16);
      expect(rating).toBe(5);
    });
  });

  /**
   * Swell height specific ligic calculation
   */
  describe('Get rating based on swell height', () => {
    it('should get a rating of 1 for less than ankle to knee high swell', () => {
      const rating = defaultRating.getRatingForSwellSize(0.2);
      expect(rating).toBe(1);
    });

    it('should get a rating of 2 for an ankle to knee swell', () => {
      const rating = defaultRating.getRatingForSwellSize(0.6);
      expect(rating).toBe(2);
    });

    it('should get a rating of 3 for a waist high swell', () => {
      const rating = defaultRating.getRatingForSwellSize(1.5);
      expect(rating).toBe(3);
    });

    it('should get a rating of 4 for a head high swell', () => {
      const rating = defaultRating.getRatingForSwellSize(2.3);
      expect(rating).toBe(4);
    });

    it('should get a rating of 5 for an overhead swell', () => {
      const rating = defaultRating.getRatingForSwellSize(2.5);
      expect(rating).toBe(5);
    });
  });

  /**
   * Location specific ligic calculation
   */
  describe('Get position based on points location', () => {
    it('should get the point based on a east location', () => {
      const position = defaultRating.getPositionFromLocation(92);
      expect(position).toBe(GeoPosition.E);
    });

    it('should get the point based on a north location 1', () => {
      const position = defaultRating.getPositionFromLocation(360);
      expect(position).toBe(GeoPosition.N);
    });

    it('should get the point based on a north location 2', () => {
      const position = defaultRating.getPositionFromLocation(40);
      expect(position).toBe(GeoPosition.N);
    });

    it('should get the point based on a south location', () => {
      const position = defaultRating.getPositionFromLocation(200);
      expect(position).toBe(GeoPosition.S);
    });

    it('should get the point based on a west location', () => {
      const position = defaultRating.getPositionFromLocation(300);
      expect(position).toBe(GeoPosition.W);
    });
  });
});
