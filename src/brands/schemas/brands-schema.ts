import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {

  @Prop({ required: true, trim: true })
  brandName: string;

  @Prop({ required: true, min: 1600, max: new Date().getFullYear() })
  yearFounded: number;

  @Prop({ required: true, trim: true })
  headquarters: string;

  @Prop({ required: true, min: 1 })
  numberOfLocations: number;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);