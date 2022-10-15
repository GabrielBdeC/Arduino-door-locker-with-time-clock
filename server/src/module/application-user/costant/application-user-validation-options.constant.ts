import { ValidatorOptions } from 'class-validator';
import { commonValidationOptions } from '../../../common/constant/common-validation-options.constant';
import { ApplicationUserAction } from '../type/application-user.action';

export const applicationUserValidationOptions: {
  [key in ApplicationUserAction]?: ValidatorOptions;
} = Object.values(ApplicationUserAction).reduce(
  (obj, key) => ({
    ...obj,
    [key]: {
      ...commonValidationOptions,
      ...{ groups: [key] },
    },
  }),
  {},
);
