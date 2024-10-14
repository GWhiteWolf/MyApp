export class HistorialActividad {
    constructor(
        public id: number,
        public fecha: string,
        public pasosTotales: number,
        public caloriasQuemadas: number,
        public distanciaRecorrida: number,
        public tiempoActividad: number,
        public metasCumplidas: number
    ) {}
}
