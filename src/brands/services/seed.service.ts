import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Brand, BrandDocument } from '../schemas/brands-schema';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
  ) {}

  async seedBrands(count: number = 10): Promise<void> {
    this.logger.log(`Starting to seed ${count} brands...`);

    const brands: Array<{
      brandName: string;
      yearFounded: number;
      headquarters: string;
      numberOfLocations: number;
    }> = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < count; i++) {
      const brand = {
        brandName: faker.company.name(),
        yearFounded: faker.number.int({ min: 1600, max: currentYear }),
        headquarters: `${faker.location.city()}, ${faker.location.country()}`,
        numberOfLocations: faker.number.int({ min: 1, max: 500 }),
      };
      brands.push(brand);
    }

    try {
      await this.brandModel.insertMany(brands);
      this.logger.log(`✓ Successfully seeded ${count} brands`);
    } catch (error) {
      this.logger.error(`✗ Failed to seed brands: ${error.message}`);
      throw error;
    }
  }
}
