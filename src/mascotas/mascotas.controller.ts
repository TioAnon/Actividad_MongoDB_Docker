import { Body, Controller, Get, Post } from '@nestjs/common';
import { MascotasService } from './mascotas.service';

@Controller('mascotas')
export class MascotasController {
  constructor(private readonly servicio: MascotasService) {}

  @Get()
  listar() {
    return this.servicio.listar();
  }

  @Post()
  crear(@Body() datos: { nombre: string; especie: string; edad: number; vacunado: boolean }) {
    return this.servicio.crear(datos);
  }
}