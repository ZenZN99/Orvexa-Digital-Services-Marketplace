var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupportMessage } from './schema/support-message.schema.js';
import { SupportConversation } from '../coversations/schema/support-conversation.schema.js';
import { TokenModule } from '../../../infrastructure/token/token.module.js';
import { CloudinaryModule } from '../../../infrastructure/cloudinary/cloudinary.module.js';
import { SupportMessageController } from './support-message.controller.js';
import { SupportMessageService } from './support-message.service.js';
import { User } from '../../users/schema/user.schema.js';
let SupportMessageModule = class SupportMessageModule {
};
SupportMessageModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([SupportMessage, SupportConversation, User]),
            TokenModule,
            CloudinaryModule,
        ],
        controllers: [SupportMessageController],
        providers: [SupportMessageService],
    })
], SupportMessageModule);
export { SupportMessageModule };
//# sourceMappingURL=support-message.module.js.map