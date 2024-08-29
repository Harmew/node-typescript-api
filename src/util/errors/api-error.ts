import httpStatusCodes from 'http-status-codes';

export interface APIError {
  message: string;
  code: number;
}

export interface APIErrorResponse extends APIError {
  error: string;
}

export default class ApiError {
  public static format(error: APIError): APIErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: httpStatusCodes.getStatusText(error.code),
      },
    };
  }
}
