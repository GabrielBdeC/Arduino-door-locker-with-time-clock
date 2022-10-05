import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '../../auth/model/user.model';
import { ApplicationUserAction } from '../type/application-user.action';
import { ApplicationUser } from '../entity/application-user.entity';
import { ApplicationUserType } from '../type/application-user.type';

type Subjects = InferSubjects<typeof ApplicationUser>;
type AppAbility = Ability<[ApplicationUserAction, Subjects]>;

@Injectable()
export class ApplicationUserAbilityFactory {
  public defineAbility(user: User) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    if (user.applicationUserType == ApplicationUserType.ADMIN) {
      can(ApplicationUserAction.MANAGE, ApplicationUser);
    } else if (user.applicationUserType == ApplicationUserType.USER) {
      can(ApplicationUserAction.GET, ApplicationUser, {
        uuid: { $eq: user.uuid },
      });
      can(ApplicationUserAction.UPDATE, ApplicationUser, {
        uuid: { $eq: user.uuid },
      });
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
