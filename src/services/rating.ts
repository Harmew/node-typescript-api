// Models
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
  /** @param {Beach} beach */
  constructor(private beach: Beach) {}

  public getRateForPoint(point: ForecastPoint): number {
    /** @description Converte a direção da onda para uma posição */ // Exemplo: GeoPosition.N
    const swellDirection = this.getPositionFromLocation(point.swellDirection);

    /** @description Converte a direção do vento para uma posição */ // Exemplo: GeoPosition.S
    const windDirection = this.getPositionFromLocation(point.windDirection);

    /** @description Busca a nota baseada na direção do vento e da onda */ // Exemplo: Wind: N, Wave: S => 5
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(swellDirection, windDirection);

    /** @description Busca a nota baseada na altura da onda */ // Exemplo: 1.5 => 3
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);

    /** @description Busca a nota baseada no período da onda */ // Exemplo: 8 => 2
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);

    /** @description Calcula a nota final baseada na média das notas anteriores */ // Exemplo: (5 + 3 + 2) / 3 => 3
    const finalRating = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

    /** @description Retorna a nota final arredondada */
    return Math.round(finalRating);
  }

  /**
   * @description Busca a nota baseada na direção do vento e da onda
   */
  public getRatingBasedOnWindAndWavePositions(waveDirection: GeoPosition, windDirection: GeoPosition): number {
    // Se a direção do vento e da onda forem iguais, a nota é 1
    if (waveDirection === windDirection) return 1;
    // Se o vento estiver a favor da onda, a nota é 5
    else if (this.isWindOffShore(waveDirection, windDirection)) return 5;
    // Se o vento estiver em 90 graus da onda, a nota é 3
    return 3;
  }

  /**
   * @description Verifica se o vento está a favor da onda (offshore)
   */
  private isWindOffShore(waveDirection: GeoPosition, windDirection: GeoPosition): boolean {
    return (
      this.isWaveNorthAndWindSouth(waveDirection, windDirection) ||
      this.isWaveSouthAndWindNorth(waveDirection, windDirection) ||
      this.isWaveEastAndWindWest(waveDirection, windDirection) ||
      this.isWaveWestAndWindEast(waveDirection, windDirection)
    );
  }

  /**
   * @description Busca a nota baseada no período da onda
   */
  public getRatingForSwellPeriod(period: number): number {
    if (period < 7) return 1;
    if (period < 10) return 2;
    if (period < 14) return 4;
    return 5;
  }

  /**
   * @description Busca a nota baseada na altura da onda
   */
  public getRatingForSwellSize(height: number): number {
    // Se a altura da onda estiver entre 0.3 e 1.0, a nota é 2
    if (height > waveHeights.ankleToKnee.min && height < waveHeights.ankleToKnee.max) return 2;

    // Se a altura da onda estiver entre 1.0 e 2.0, a nota é 3
    if (height > waveHeights.waistHigh.min && height < waveHeights.waistHigh.max) return 3;

    // Se a altura da onda estiver entre 2.0 e 2.5, a nota é
    if (height > waveHeights.headHigh.min && height < waveHeights.headHigh.max) return 5;

    // Se a altura da onda for maior que 2.5, a nota é 4
    if (height > waveHeights.headHigh.max) return 4;

    // Se a altura da onda for menor que 0.3, a nota é 1
    return 1;
  }

  /**
   * @description Converte a localização em graus para uma posição (N, S, E, W)
   */
  public getPositionFromLocation(coordinates: number): GeoPosition {
    if (coordinates < 50) return GeoPosition.N;
    if (coordinates < 120) return GeoPosition.E;
    if (coordinates < 220) return GeoPosition.S;
    if (coordinates < 310) return GeoPosition.W;
    return GeoPosition.N;
  }

  /**
   * @description Verifica se a onda está vindo do norte e o vento do sul e a praia está localizada ao norte
   */
  private isWaveNorthAndWindSouth(wavePosition: GeoPosition, windPosition: GeoPosition): boolean {
    return wavePosition === GeoPosition.N && windPosition === GeoPosition.S && this.beach.position === GeoPosition.N;
  }

  /**
   * @description Verifica se a onda está vindo do sul e o vento do norte e a praia está localizada ao sul
   */
  private isWaveSouthAndWindNorth(wavePosition: GeoPosition, windPosition: GeoPosition): boolean {
    return wavePosition === GeoPosition.S && windPosition === GeoPosition.N && this.beach.position === GeoPosition.S;
  }

  /**
   * @description Verifica se a onda está vindo do leste e o vento do oeste e a praia está localizada ao leste
   */
  private isWaveEastAndWindWest(wavePosition: GeoPosition, windPosition: GeoPosition): boolean {
    return wavePosition === GeoPosition.E && windPosition === GeoPosition.W && this.beach.position === GeoPosition.E;
  }

  /**
   * @description Verifica se a onda está vindo do oeste e o vento do leste e a praia está localizada ao oeste
   */
  private isWaveWestAndWindEast(wavePosition: GeoPosition, windPosition: GeoPosition): boolean {
    return wavePosition === GeoPosition.W && windPosition === GeoPosition.E && this.beach.position === GeoPosition.W;
  }
}
