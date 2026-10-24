import { Model } from 'mongoose';
import { Mascota } from './schemas/mascota.schema';
export declare class MascotasService {
    private readonly modelo;
    constructor(modelo: Model<Mascota>);
    listar(): Promise<(import("mongoose").Document<unknown, {}, Mascota, {}, {}> & Mascota & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    crear(datos: {
        nombre: string;
        especie: string;
        edad: number;
        vacunado: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, Mascota, {}, {}> & Mascota & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
