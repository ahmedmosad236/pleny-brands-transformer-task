import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from '../brands/services/seed.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Seed');
  
  logger.log('🚀 Starting Brand Seeding...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seedService = app.get(SeedService);
    await seedService.seedBrands(10);
    logger.log('✅ Seeding completed successfully!');
  } catch (error) {
    logger.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
