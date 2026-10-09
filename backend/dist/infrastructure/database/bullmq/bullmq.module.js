var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
let BullMQModule = class BullMQModule {
};
BullMQModule = __decorate([
    Module({
        imports: [
            BullModule.forRoot({
                connection: {
                    url: process.env.REDIS_URL,
                },
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 1000,
                    },
                    removeOnComplete: true,
                    removeOnFail: {
                        count: 1000,
                    },
                },
            }),
        ],
        exports: [BullModule],
    })
], BullMQModule);
export { BullMQModule };
//# sourceMappingURL=bullmq.module.js.map