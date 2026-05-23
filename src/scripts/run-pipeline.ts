import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TransformService } from '../brands/services/transform.service';
import { SeedService } from '../brands/services/seed.service';
import { ExportService } from '../brands/services/export.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Pipeline');
  
  logger.log('🚀 Starting Brand Transformation Pipeline...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Step 1: Transform existing brands
    logger.log('📝 Step 1: Transforming existing brands...');
    const transformService = app.get(TransformService);
    await transformService.transformBrands();

    // Step 2: Seed new brands
    logger.log('🌱 Step 2: Seeding new brands...');
    const seedService = app.get(SeedService);
    await seedService.seedBrands(10);

    // Step 3: Export all brands
    logger.log('📤 Step 3: Exporting brands...');
    const exportService = app.get(ExportService);
    await exportService.exportBrands('exported-brands.json');

    logger.log('✅ Pipeline completed successfully!');
  } catch (error) {
    logger.error('❌ Pipeline failed:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
