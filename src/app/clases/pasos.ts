export class Pasos {
    constructor(
        public id: number,
        public fecha: string,
        public conteo_pasos: number,
        public meta: number,
        public meta_cumplida: number = 0
    ) {}
}
