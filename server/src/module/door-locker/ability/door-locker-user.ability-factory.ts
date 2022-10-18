import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../auth/model/user.model';
import { DoorLockerUserAction } from '../type/door-locker-user.action';
import { DoorLockerUser } from '../entity/door-locker-user.entity';
import { ApplicationUserType } from '../../application-user/type/application-user.type';

type Subjects = InferSubjects<typeof DoorLockerUser>;
type AppAbility = Ability<[DoorLockerUserAction, Subjects]>;

@Injectable()
export class DoorLockerUserAbilityFactory {
  public defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.applicationUserType == ApplicationUserType.ADMIN) {
      can(DoorLockerUserAction.MANAGE, DoorLockerUser);
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
