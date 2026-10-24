import { HydratedDocument } from 'mongoose';
export type MascotaDocument = HydratedDocument<Mascota>;
export declare class Mascota {
    nombre: string;
    especie: string;
    edad: number;
    vacunado: boolean;
}
export declare const MascotaSchema: import("mongoose").Schema<Mascota, import("mongoose").Model<Mascota, any, any, any, import("mongoose").Document<unknown, any, Mascota, any, {}> & Mascota & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Mascota, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Mascota>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Mascota> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
