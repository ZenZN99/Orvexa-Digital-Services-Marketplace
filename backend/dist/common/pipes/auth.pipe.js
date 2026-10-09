var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BadRequestException, Injectable } from '@nestjs/common';
let AuthPipe = class AuthPipe {
    transform(value) {
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
};
AuthPipe = __decorate([
    Injectable()
], AuthPipe);
export { AuthPipe };
//# sourceMappingURL=auth.pipe.js.map