import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

// Service
import { Rating, type PARAMS } from '@src/services/rating';

// Controllers
import { BaseController } from '.';

const rating = new Rating();

@Controller('rating')
export class RatingController extends BaseController {
  @Post('')
  public async getRating(req: Request, res: Response): Promise<void> {
    try {
      const { swellHeightRating, swellPeriod, windAndWaveRating } = req.body;

      if (!this.validateAllParams({ swellHeightRating, swellPeriod, windAndWaveRating })) {
        this.sendErrorResponse(res, { code: 400, message: 'Parâmetros inválidos!' });
        return;
      }

      const ratingData = rating.calculateRating({ swellHeightRating, swellPeriod, windAndWaveRating });
      res.status(200).send({ note: ratingData });
    } catch (err) {
      this.sendErrorResponse(res, { code: 500, message: 'Algo deu errado!' });
    }
  }

  /**
   * @description Valida todos os parâmetros de rating
   * @param {PARAMS} params
   * @returns {boolean}
   */
  private validateAllParams(params: PARAMS): boolean {
    if (!this.validateRatingParams(params)) return false;
    if (!this.validateRatingParamsMaxValue(params)) return false;
    if (!this.validateRatingParamsMinValue(params)) return false;
    return true;
  }

  /**
   * @description Valida se os parâmetros de rating são números
   * @param {PARAMS} { swellHeightRating, swellPeriod, windAndWaveRating }
   * @returns {boolean}
   */
  private validateRatingParams({ swellHeightRating, swellPeriod, windAndWaveRating }: PARAMS): boolean {
    return typeof swellHeightRating === 'number' && typeof swellPeriod === 'number' && typeof windAndWaveRating === 'number';
  }

  /**
   * @description Valida se os valores dos parâmetros de rating são menores ou iguais a 5
   * @param {PARAMS} { swellHeightRating, windAndWaveRating }
   * @returns {boolean}
   */
  private validateRatingParamsMaxValue({ swellHeightRating, windAndWaveRating }: Omit<PARAMS, 'swellPeriod'>): boolean {
    return swellHeightRating <= 5 && windAndWaveRating <= 5;
  }

  /**
   * @description Valida se os valores dos parâmetros são maiores ou iguais a 1
   * @param {PARAMS} { swellHeightRating, windAndWaveRating, swellPeriod }
   * @returns {boolean}
   */
  private validateRatingParamsMinValue({ swellHeightRating, windAndWaveRating, swellPeriod }: PARAMS): boolean {
    return swellHeightRating >= 1 && windAndWaveRating >= 1 && swellPeriod >= 1;
  }
}
