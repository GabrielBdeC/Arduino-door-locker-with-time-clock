import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UUIDPipe } from '../../../common/pipe/uuid.pipe';
import { ApplicationUserAbilityFactory } from '../ability/application-user.ability-factory';
import { APPLICATION_USER_ABILITY } from '../decorator/application-user-abilities.decorator';
import { ApplicationUser } from '../entity/application-user.entity';
import { ApplicationUserAction } from '../type/application-user.action';

@Injectable()
export class ApplicationUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private applicationUserAbilityFactory: ApplicationUserAbilityFactory,
    private uuidPipe: UUIDPipe,
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const applicationUserActionAbilities =
      this.reflector.get<ApplicationUserAction[]>(
        APPLICATION_USER_ABILITY,
        context.getHandler(),
      ) || [];
    const { user } = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest();
    let uuid = request?.params?.uuid;
    if (uuid) {
      uuid = this.uuidPipe.transform(uuid);
    }
    const applicationUser: ApplicationUser = new ApplicationUser();
    applicationUser.uuid = uuid;
    const ability = this.applicationUserAbilityFactory.defineAbility(user);
    return applicationUserActionAbilities.every(
      (applicationUserAction: ApplicationUserAction) =>
        ability.can(applicationUserAction, applicationUser),
    );
  }
}
