import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DoorLockerUserAbilityFactory } from '../ability/door-locker-user.ability-factory';
import { DOOR_LOCKER_USER_ABILITY } from '../decorator/door-locker-user-abilities.decorator';
import { DoorLockerUser } from '../entity/door-locker-user.entity';
import { DoorLockerUserAction } from '../type/door-locker-user.action';

@Injectable()
export class LockerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private doorLockerUserAbilityFactory: DoorLockerUserAbilityFactory,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const doorLockerUserActionAbilities =
      this.reflector.get<DoorLockerUserAction[]>(
        DOOR_LOCKER_USER_ABILITY,
        context.getHandler(),
      ) || [];
    const { user } = context.switchToHttp().getRequest();
    const ability = this.doorLockerUserAbilityFactory.defineAbility(user);
    return doorLockerUserActionAbilities.every(
      (doorLockerUserAction: DoorLockerUserAction) =>
        ability.can(doorLockerUserAction, DoorLockerUser),
    );
  }
}
