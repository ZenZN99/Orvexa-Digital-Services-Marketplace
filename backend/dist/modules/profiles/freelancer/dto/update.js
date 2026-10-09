var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayMaxSize, ArrayUnique, IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength, } from 'class-validator';
import { JobTitle, Skills } from '../../../../common/enums/freelancer.enum.js';
import { dtoMessages } from '../../../../common/libs/dto-messages.js';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateFreelancerDTO {
    jobTitle;
    about;
    skills;
    website;
}
__decorate([
    ApiProperty({
        enum: JobTitle,
        required: false,
        example: JobTitle.SOFTWARE_ENGINEER,
    }),
    IsOptional(),
    IsEnum(JobTitle, {
        message: dtoMessages.freelancer.jobTitle.isEnum,
    }),
    __metadata("design:type", String)
], UpdateFreelancerDTO.prototype, "jobTitle", void 0);
__decorate([
    ApiProperty({
        required: false,
        example: 'Hello, I’m Zen, a software engineer, and I sell micro-services.',
        minLength: 3,
        maxLength: 500,
    }),
    IsOptional(),
    IsString({
        message: dtoMessages.freelancer.about.isString,
    }),
    MinLength(3, {
        message: dtoMessages.freelancer.about.minLength,
    }),
    MaxLength(500, {
        message: dtoMessages.freelancer.about.maxLength,
    }),
    __metadata("design:type", String)
], UpdateFreelancerDTO.prototype, "about", void 0);
__decorate([
    ApiProperty({
        required: false,
        enum: Skills,
        isArray: true,
        example: [
            Skills.NEST_JS,
            Skills.TYPESCRIPT,
            Skills.POSTGRESQL,
            Skills.ANGULAR,
        ],
        maxItems: 10,
    }),
    IsOptional(),
    IsArray({
        message: dtoMessages.freelancer.skills.isArray,
    }),
    ArrayMaxSize(10, {
        message: dtoMessages.freelancer.skills.maxSize,
    }),
    ArrayUnique({
        message: dtoMessages.freelancer.skills.unique,
    }),
    IsEnum(Skills, {
        each: true,
        message: dtoMessages.freelancer.skills.isEnum,
    }),
    __metadata("design:type", Array)
], UpdateFreelancerDTO.prototype, "skills", void 0);
__decorate([
    ApiProperty({
        required: false,
        example: 'https://example.com',
        maxLength: 255,
    }),
    IsOptional(),
    IsString({
        message: dtoMessages.freelancer.website.isString,
    }),
    MaxLength(255, {
        message: dtoMessages.freelancer.website.maxLength,
    }),
    __metadata("design:type", String)
], UpdateFreelancerDTO.prototype, "website", void 0);
//# sourceMappingURL=update.js.map