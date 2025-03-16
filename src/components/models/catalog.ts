import { ILot } from "../../types";
import { IEvents } from "../base/events";
import { Model } from "../base/Model";

export class Catalog extends Model{
    private _lots: ILot[];
    public static EventTopic = "catalog";
    public static CatalogChanged = Catalog.EventTopic + ":" + "changed";
    constructor(events: IEvents){
        super(events);
        this._lots = [];
    }

    addLots(lots: ILot[]){
        lots.forEach(l => {
            if(!this._lots.some(i => i.id == l.id))
                this._lots.push(l);
        });
        this.emitChanges(Catalog.CatalogChanged, this._lots);
    }

    getLots(): ILot[]{
        return this._lots;
    }
}

