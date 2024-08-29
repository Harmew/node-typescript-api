import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

// Service
import { Forecast } from '@src/services/forecast';

// Controllers
import { BaseController } from '.';

// Models
import { Beach } from '@src/models/beach';

const forecast = new Forecast();

@Controller('forecast')
export class ForecastController extends BaseController {
  @Post('')
  public async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const beaches: Beach = req.body;
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (err) {
      this.sendErrorResponse(res, { code: 500, message: 'Algo deu errado!' });
    }
  }
}
