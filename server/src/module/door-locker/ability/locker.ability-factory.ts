import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../auth/model/user.model';
import { LockerAction } from '../type/locker.action';
import { ApplicationUserType } from '../../application-user/type/application-user.type';

type AppAbility = Ability<[LockerAction, 'all']>;

@Injectable()
export class LockerAbilityFactory {
  public defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.applicationUserType == ApplicationUserType.ADMIN) {
      can(LockerAction.MANAGE, 'all');
    } else if (user.applicationUserType == ApplicationUserType.LOCKER) {
      can(LockerAction.UNLOCK, 'all');
    }
    return build();
  }
}
