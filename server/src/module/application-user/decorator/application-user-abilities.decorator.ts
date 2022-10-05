import { SetMetadata } from '@nestjs/common';
import { ApplicationUserAction } from '../type/application-user.action';

export const APPLICATION_USER_ABILITY = 'application_user_ability';
export const ApplicationUserAbilities = (
  ...applicationUserAction: ApplicationUserAction[]
) => SetMetadata(APPLICATION_USER_ABILITY, applicationUserAction);
