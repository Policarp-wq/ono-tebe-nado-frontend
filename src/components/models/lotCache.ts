import { LotStatus } from "../../types";

export interface ILotInfo {
    status: LotStatus,
    price?: number
}

export class LotCache{
    private _info: { [key: string]: ILotInfo } = {}

    get(id: string) : ILotInfo | undefined{
        return this._info[id];
    }
    set(id: string, info : ILotInfo){
        this._info[id] = info;
    }
}