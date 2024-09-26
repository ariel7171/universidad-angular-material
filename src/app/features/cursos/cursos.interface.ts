export interface Curso {
    id: string;
    nombre: string;
    descripcion: string;
    profesor_id: number;
    creatAt: Date;
    updatedAt: Date;
    actions: string;
}