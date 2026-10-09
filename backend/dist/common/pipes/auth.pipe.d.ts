import { PipeTransform } from '@nestjs/common';
import { User } from '../../modules/users/schema/user.schema.js';
export declare class AuthPipe implements PipeTransform {
    transform(value: User): User;
}
