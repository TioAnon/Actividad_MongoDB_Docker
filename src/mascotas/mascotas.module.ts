import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MascotasController } from './mascotas.controller';
import { MascotasService } from './mascotas.service';
import { Mascota, MascotaSchema } from './schemas/mascota.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mascota.name, schema: MascotaSchema },
    ]),
  ],
  controllers: [MascotasController],
  providers: [MascotasService],
})
export class MascotasModule {}