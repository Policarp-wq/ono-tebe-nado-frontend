import {IEvents} from "./events";

// Гарда для проверки на модель
export const isModel = (obj: unknown): obj is Model => {
    return obj instanceof Model;
}

export abstract class Model{
    constructor(protected events: IEvents) {
    }
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}