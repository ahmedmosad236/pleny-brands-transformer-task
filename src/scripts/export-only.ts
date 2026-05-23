import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ExportService } from '../brands/services/export.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Export');
  
  logger.log('🚀 Starting Brand Export...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const exportService = app.get(ExportService);
    await exportService.exportBrands('exported-brands.json');
    logger.log('✅ Export completed successfully!');
  } catch (error) {
    logger.error('❌ Export failed:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
