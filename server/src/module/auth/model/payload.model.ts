import { User } from './user.model';

export class Payload {
  public expire: number;
  public iat: number;
  public user: User;
}
