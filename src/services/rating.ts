import { Beach, GeoPosition } from '@src/models/beach';
import { ForecastPoint } from '@src/clients/stormGlass';

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
} as const;

export class Rating {
  constructor(private beach: Beach) {}

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(swellDirection, windDirection);
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);

    const harmonicMean = 3 / (1 / windAndWaveRating + 1 / swellHeightRating + 1 / swellPeriodRating);
    const weightedSum = windAndWaveRating * 0.4 + swellHeightRating * 0.3 + swellPeriodRating * 0.3;
    const finalRating = Math.sqrt(harmonicMean * weightedSum);

    return Math.round(finalRating);
  }

  public getRatingBasedOnWindAndWavePositions(waveDirection: number, windDirection: number): number {
    const angleDifference = Math.abs(waveDirection - windDirection);

    const adjustedRating = Math.cos(angleDifference * (Math.PI / 180)) * 5;

    return this.isWindOffShore(waveDirection, windDirection) ? adjustedRating : Math.max(3, adjustedRating);
  }

  private isWindOffShore(waveDirection: number, windDirection: number): boolean {
    const beachDirection = this.getDegreesFromPosition(this.beach.position);
    const offshoreTolerance = 45; // Tolerância para considerar o vento offshore

    const waveRelativeToBeach = Math.abs(beachDirection - waveDirection);
    const windRelativeToBeach = Math.abs(beachDirection - windDirection);

    // Verifica se o vento está vindo do lado oposto da direção da ondulação
    return windRelativeToBeach >= 180 - offshoreTolerance && waveRelativeToBeach <= offshoreTolerance;
  }

  public getRatingForSwellPeriod(period: number): number {
    const baseRating = period / 5;
    return Math.min(5, Math.max(1, Math.log2(baseRating) + 1));
  }

  public getRatingForSwellSize(height: number): number {
    const normalizedHeight = (height - waveHeights.ankleToKnee.min) / (waveHeights.headHigh.max - waveHeights.ankleToKnee.min);
    const quadraticAdjustment = -4 * Math.pow(normalizedHeight - 0.5, 2) + 5;

    return Math.max(1, Math.min(5, quadraticAdjustment));
  }

  public getPositionFromLocation(coordinates: number): number {
    return coordinates % 360; // Normaliza o ângulo para o intervalo [0, 360)
  }

  private getDegreesFromPosition(position: GeoPosition): number {
    switch (position) {
      case GeoPosition.N:
        return 0;
      case GeoPosition.NE:
        return 45;
      case GeoPosition.E:
        return 90;
      case GeoPosition.SE:
        return 135;
      case GeoPosition.S:
        return 180;
      case GeoPosition.SW:
        return 225;
      case GeoPosition.W:
        return 270;
      case GeoPosition.NW:
        return 315;
      default:
        return 0;
    }
  }
}
