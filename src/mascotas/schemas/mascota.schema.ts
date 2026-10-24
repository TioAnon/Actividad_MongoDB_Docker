import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MascotaDocument = HydratedDocument<Mascota>;

@Schema({ timestamps: true })
export class Mascota {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  especie: string;

  @Prop({ required: true, min: 0 })
  edad: number;

  @Prop({ required: true, default: false })
  vacunado: boolean;
}

export const MascotaSchema = SchemaFactory.createForClass(Mascota);