import { SetMetadata } from '@nestjs/common';
import { DoorLockerUserAction } from '../type/door-locker-user.action';

export const DOOR_LOCKER_USER_ABILITY = 'door_locker_user_ability';
export const DoorLockerUserAbilities = (
  ...doorLockerUserAction: DoorLockerUserAction[]
) => SetMetadata(DOOR_LOCKER_USER_ABILITY, doorLockerUserAction);
