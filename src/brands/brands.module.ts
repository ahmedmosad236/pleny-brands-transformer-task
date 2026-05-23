import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './schemas/brands-schema';
import { TransformService } from './services/transform.service';
import { SeedService } from './services/seed.service';
import { ExportService } from './services/export.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema }
    ])
  ],
  providers: [TransformService, SeedService, ExportService],
  exports: [TransformService, SeedService, ExportService],
})
export class BrandsModule {}