import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/sequelize';
import { AppModule } from './app.module.js';
import { runSeeders } from './infrastructure/database/seeders/index.js';
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    try {
        const sequelize = app.get(getConnectionToken());
        console.log('🚀 Starting Database Seeder...\n');
        await runSeeders(sequelize);
        console.log('\n🎉 Database Seed Completed Successfully');
    }
    catch (error) {
        console.error('❌ Seeder Failed');
        console.error(error);
    }
    finally {
        await app.close();
        process.exit(0);
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map