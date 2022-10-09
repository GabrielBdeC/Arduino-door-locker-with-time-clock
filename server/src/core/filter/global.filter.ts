import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ErrorDtoType, ExceptionDto } from '../dto/exception.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const errorsAndStatus = this.determineErrorsAndStatus(exception);
    const responseBody: ExceptionDto = {
      status: errorsAndStatus.status,
      timestamp: new Date().toISOString(),
      location: httpAdapter.getRequestUrl(request),
      method: request.method,
      errors: errorsAndStatus.errors,
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, errorsAndStatus.status);
  }

  private determineErrorsAndStatus(exception: unknown): {
    status: number;
    errors: ErrorDtoType[];
  } {
    if (exception instanceof HttpException) {
      return {
        status: (exception as HttpException).getStatus(),
        errors: [
          {
            reason: (exception as HttpException).name,
            message: (exception as HttpException).message,
          },
        ],
      };
    } else if (exception instanceof EntityNotFoundError) {
      return {
        status: HttpStatus.NOT_FOUND,
        errors: [
          {
            reason: (exception as EntityNotFoundError).name,
            message: 'Not Found',
          },
        ],
      };
    } else if (exception instanceof QueryFailedError) {
      if ((exception as QueryFailedError).driverError.sql) {
        switch ((exception as QueryFailedError).driverError.code) {
          case 'ER_DUP_ENTRY':
            return {
              status: HttpStatus.CONFLICT,
              errors: [
                {
                  reason: exception.constructor.name,
                  message: 'Duplicated value',
                },
              ],
            };
          default:
            return {
              status: HttpStatus.BAD_REQUEST,
              errors: [
                {
                  reason: exception.constructor.name,
                  message: 'Unkown',
                },
              ],
            };
        }
      }
    } else if (
      Array.isArray(exception) &&
      exception.every((el: any) => el instanceof ValidationError)
    ) {
      const errors = [];
      exception.forEach((validationError: ValidationError) => {
        Object.values(validationError.constraints).forEach((value: string) => {
          errors.push({
            reason: validationError.property,
            message: value,
          });
        });
      });
      return {
        status: HttpStatus.BAD_REQUEST,
        errors: errors,
      };
    } else {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            reason: exception.constructor.name,
            message: 'Unkown',
          },
        ],
      };
    }
  }
}
