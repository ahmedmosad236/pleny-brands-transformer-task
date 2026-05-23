import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { TransformService } from '../brands/services/transform.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Transform');
  
  logger.log('🚀 Starting Brand Transformation...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const transformService = app.get(TransformService);
    await transformService.transformBrands();
    logger.log('✅ Transformation completed successfully!');
  } catch (error) {
    logger.error('❌ Transformation failed:', error.message);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
