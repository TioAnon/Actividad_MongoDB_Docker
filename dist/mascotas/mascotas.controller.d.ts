import { MascotasService } from './mascotas.service';
export declare class MascotasController {
    private readonly servicio;
    constructor(servicio: MascotasService);
    listar(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/mascota.schema").Mascota, {}, {}> & import("./schemas/mascota.schema").Mascota & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    crear(datos: {
        nombre: string;
        especie: string;
        edad: number;
        vacunado: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/mascota.schema").Mascota, {}, {}> & import("./schemas/mascota.schema").Mascota & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
