import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mascota } from './schemas/mascota.schema';

@Injectable()
export class MascotasService {
  constructor(
    @InjectModel(Mascota.name)
    private readonly modelo: Model<Mascota>,
  ) {}

  listar() {
    return this.modelo.find().exec();
  }

  crear(datos: { nombre: string; especie: string; edad: number; vacunado: boolean }) {
    return this.modelo.create(datos);
  }
}