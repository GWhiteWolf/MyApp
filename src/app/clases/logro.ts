// clases/logro.ts
export class Logro {
    constructor(
        public id: number,
        public nombre_logro: string,
        public descripcion: string,
        public tipo: string,
        public objetivo: number,
        public estado: number = 0, // 0 bloqueado, 1 desbloqueado
        public icono: string = 'lock-closed-outline' // Icono inicial de candado
        ) {}
}
