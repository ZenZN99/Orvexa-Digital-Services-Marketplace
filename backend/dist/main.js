import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import { FRONTEND_URL } from './url.js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { TokenService } from './infrastructure/token/token.service.js';
import { AuthSocketAdapter } from './infrastructure/adapters/socket.adapter.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
        rawBody: true,
    });
    app.use(cookieParser());
    app.enableCors({
        origin: FRONTEND_URL,
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: (errors) => {
            const firstError = errors[0];
            const firstMessage = Object.values(firstError.constraints || {})[0];
            return new BadRequestException({ message: firstMessage });
        },
    }));
    const tokenService = app.get(TokenService);
    app.useWebSocketAdapter(new AuthSocketAdapter(app, tokenService));
    const config = new DocumentBuilder()
        .setTitle('Orvexa — Freelance Services Marketplace')
        .setDescription('Freelance Services Marketplace Backend API Documentation')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 4001);
    console.log(`NestJS server is running on http://localhost:${process.env.PORT}`);
}
await bootstrap();
//# sourceMappingURL=main.js.map