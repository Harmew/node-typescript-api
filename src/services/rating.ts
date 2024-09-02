export interface PARAMS {
  windAndWaveRating: number;
  swellHeightRating: number;
  swellPeriod: number;
}

export class Rating {
  /**
   * @description Calcula a nota final baseada nos ratings de vento e onda, altura da onda e período da onda
   * @param {PARAMS} { windAndWaveRating, swellHeightRating, swellPeriod }
   * @returns {number}
   */
  public calculateRating({ windAndWaveRating, swellHeightRating, swellPeriod }: PARAMS): number {
    /** @description Retorna uma nota de 1 a 5 baseada no período da onda */
    const swellPeriodRating = this.getRatingForSwellPeriod(swellPeriod);

    /** @description Retorna a soma ponderada dos ratings */
    const weightedSum = this.getWeightedSum(windAndWaveRating, swellHeightRating, swellPeriodRating);

    /** @description Retorna a nota final */
    return Math.round(weightedSum);
  }

  /**
   * @description Retorna uma nota de 1 a 5 baseada no período da onda
   * @description Função para a matéria de Estruturas Matemáticas
   * @param {number} period
   * @returns {number}
   */
  private getRatingForSwellPeriod(period: number): number {
    return Math.round(Math.min(5, Math.max(1, Math.log2(period) + 1)));
  }

  /**
   * @description Retorna a soma ponderada dos ratings
   * @description Função para a matéria de Compiladores
   * @param {number} windAndWaveRating
   * @param {number} swellHeightRating
   * @param {number} swellPeriodRating
   * @returns {number}
   */
  private getWeightedSum(windAndWaveRating: number, swellHeightRating: number, swellPeriodRating: number): number {
    return windAndWaveRating * 0.4 + swellHeightRating * 0.3 + swellPeriodRating * 0.3;
  }
}
