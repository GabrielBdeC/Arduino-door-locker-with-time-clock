import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UUIDPipe implements PipeTransform {
  public transform(uuid: string) {
    if (typeof uuid !== 'string')
      throw new BadRequestException('Invalid UUID DataType');
    uuid = uuid.replace(/[\W]+/g, '');
    if (uuid.length !== 32) {
      throw new BadRequestException('Invalid UUID Length');
    }
    if (
      uuid.match(
        /^[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}$/,
      )
    ) {
      return uuid.toUpperCase();
    } else {
      throw new BadRequestException('Invalid UUID');
    }
  }

  public unformat(uuid: string): string {
    const resp = this.transform(uuid);
    if (resp) return resp;
    else {
      throw new BadRequestException('Invalid UUID');
    }
  }

  public format(uuid: string): string {
    if (this.transform(uuid))
      return uuid
        .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
        .toUpperCase();
    else {
      throw new BadRequestException('Invalid UUID');
    }
  }
}
