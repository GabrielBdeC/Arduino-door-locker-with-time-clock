import { ValidatorOptions } from 'class-validator';

export const commonValidationOptions: ValidatorOptions = {
  enableDebugMessages: false,
  skipUndefinedProperties: false,
  skipNullProperties: false,
  skipMissingProperties: false,
  validationError: {
    target: false,
    value: false,
  },
  forbidUnknownValues: true,
} as const;
