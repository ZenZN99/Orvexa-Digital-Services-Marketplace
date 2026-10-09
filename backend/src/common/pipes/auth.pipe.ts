import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { User } from '../../modules/users/schema/user.schema.js';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: User) {
    if (value.email) {
      value.email = value.email.toLowerCase().trim();
    }

    if (value.firstName) {
      value.firstName = value.firstName.trim().replace(/\s+/g, ' ');
    }

    if (value.lastName) {
      value.lastName = value.lastName.trim().replace(/\s+/g, ' ');
    }

    if (value.password) {
      if (/\s/.test(value.password)) {
        throw new BadRequestException('Password must not contain spaces');
      }
      value.password = value.password.trim();
    }

    return value;
  }
}
