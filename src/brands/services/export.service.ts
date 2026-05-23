import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Brand, BrandDocument } from '../schemas/brands-schema';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
  ) {}

  async exportBrands(filename: string = 'exported-brands.json'): Promise<void> {
    this.logger.log('Starting brand export...');

    try {
      const brands = await this.brandModel.find({}).lean().exec();
      this.logger.log(`Found ${brands.length} brands to export`);

      const filePath = join(process.cwd(), filename);
      await writeFile(filePath, JSON.stringify(brands, null, 2), 'utf-8');

      this.logger.log(`✓ Successfully exported ${brands.length} brands to ${filename}`);
    } catch (error) {
      this.logger.error(`✗ Failed to export brands: ${error.message}`);
      throw error;
    }
  }
}
