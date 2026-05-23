import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '../schemas/brands-schema';

@Injectable()
export class TransformService {
  private readonly logger = new Logger(TransformService.name);

  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
  ) {}

  async transformBrands(): Promise<void> {
    this.logger.log('Starting brand transformation...');
    
    const brands = await this.brandModel.collection.find({}).toArray();
    this.logger.log(`Found ${brands.length} brands to transform`);

    let successCount = 0;
    let errorCount = 0;

    for (const brand of brands) {
      try {
        const updatedBrand: any = {};

        
        if (brand.brandName && typeof brand.brandName === 'string') {
          updatedBrand.brandName = brand.brandName.trim();
        } else if (brand.brand?.name) {
          updatedBrand.brandName = String(brand.brand.name).trim();
        } else {
          updatedBrand.brandName = 'Unknown Brand';
        }

      
        let yearFounded =
          brand.yearFounded ??
          brand.yearCreated ??
          brand.yearsFounded;

        yearFounded = Number(yearFounded);

        if (
          isNaN(yearFounded) ||
          yearFounded < 1600 ||
          yearFounded > new Date().getFullYear()
        ) {
          yearFounded = 1600;
        }

        updatedBrand.yearFounded = yearFounded;

        
        const headquarters =
          brand.headquarters ?? brand.hqAddress;

        updatedBrand.headquarters = headquarters
          ? String(headquarters).trim()
          : 'Unknown Headquarters';

        
        let numberOfLocations = Number(
          brand.numberOfLocations,
        );

        if (
          isNaN(numberOfLocations) ||
          numberOfLocations < 1
        ) {
          numberOfLocations = 1;
        }

        updatedBrand.numberOfLocations = numberOfLocations;

        const validatedBrand = new this.brandModel(updatedBrand);
        await validatedBrand.validate();

       
        await this.brandModel.updateOne(
          { _id: brand._id },
          {
            $set: updatedBrand,
            $unset: {
              yearCreated: '',
              yearsFounded: '',
              hqAddress: '',
              brand: '',
            },
          },
        );

        successCount++;
        this.logger.log(`✓ Brand updated: ${brand._id}`);
      } catch (error) {
        errorCount++;
        this.logger.error(
          `✗ Failed updating brand ${brand._id}: ${error.message}`,
        );
      }
    }

    this.logger.log(`Transformation complete: ${successCount} succeeded, ${errorCount} failed`);
  }
}