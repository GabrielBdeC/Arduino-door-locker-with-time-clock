import rawbody from 'raw-body';
import {
  Body,
  Controller,
  Headers,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNhYWFhYTQ1NnNkc2FkYXNkYXNkYXNkYXNkYXNkYXNkNzg5MCIsIm5hbWUiOiJKb2hhc2Rhc2Rhc2Rhc2Rhc2Rhc3Z2dnZ2dnZ2dm4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.OARZIdBaLnYR5qKB1xR3b8AmqJ8fZsMRYiy6zSZEgcs';

@Controller('v1/locker')
export class LockerController {
  @Post()
  public async unlock(
    @Body() rfid: number,
    @Headers() headers,
    @Req() req,
  ): Promise<string> {
    if (headers['authorization'] == `Bearer ${jwt}`) {
      if (req.readable) {
        rfid = parseInt((await rawbody(req)).toString().trim());
      }
      if (rfid == 12345) {
        return 'OK';
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
