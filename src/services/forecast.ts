import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';

import { Rating } from './rating';
import logger from '@src/logger';
import { Beach } from '@src/models/beach';

export interface BeachForecast extends Beach, ForecastPoint {}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Ocorreu um erro inesperado no processamento do forecast: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass(), protected RatingService: typeof Rating = Rating) {}

  public async processForecastForBeaches(beach: Beach): Promise<BeachForecast[]> {
    try {
      return await this.calculateRating(beach);
    } catch (err) {
      logger.error(err as Error);
      throw new ForecastProcessingInternalError((err as Error).message);
    }
  }

  private async calculateRating(beach: Beach): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    logger.info(`Preparando o forecast para a praia ${beach.name}`);

    const rating = new this.RatingService(beach);
    const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
    const enrichedBeachData = this.enrichedBeachData(points, beach, rating);
    pointsWithCorrectSources.push(...enrichedBeachData);

    return pointsWithCorrectSources;
  }

  private enrichedBeachData(points: ForecastPoint[], beach: Beach, rating: Rating): BeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point),
      },
      ...point,
    }));
  }
}
