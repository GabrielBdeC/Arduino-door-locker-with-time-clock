import { ValidatorOptions } from 'class-validator';
import { commonValidationOptions } from '../../../common/constant/common-validation-options.constant';
import { DoorLockerUserAction } from '../type/door-locker-user.action';

export const doorLockerUserValidationOptions: {
  [key in DoorLockerUserAction]?: ValidatorOptions;
} = Object.values(DoorLockerUserAction).reduce(
  (obj, key) => ({
    ...obj,
    [key]: {
      ...commonValidationOptions,
      ...{ groups: [key] },
    },
  }),
  {},
);
