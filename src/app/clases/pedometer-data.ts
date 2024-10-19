export interface PedometerData {
    startDate: Date;
    endDate: Date;
    numberOfSteps: number;
    distance: number; // en metros
    floorsAscended: number;
    floorsDescended: number;
}
