import { IBasketBidActiveCheckInfo } from "../../types";
import { IEvents } from "../base/events";

export class OrderBuilder{
    private  _bids: IBasketBidActiveCheckInfo[];
    private _total = 0;
    public static TotalChangedEvent = "order:total_changed";
    constructor(public events: IEvents){
        this._bids = [];
    }
    addBid(bid: IBasketBidActiveCheckInfo){
        if(this._bids.some(b => b.lotId == bid.lotId)){
            return;
        }
        this._bids.push(bid);
        this._total += bid.price;
        this.events.emit(OrderBuilder.TotalChangedEvent, {total: this._total});
    }
    removeBid(bid: IBasketBidActiveCheckInfo){
        if(!this._bids.some(b => b.lotId == bid.lotId)){
            return;
        }
        this._bids = this._bids.filter(b => b.lotId != bid.lotId);
        this._total -= bid.price;
        this.events.emit(OrderBuilder.TotalChangedEvent, {total: this._total});
    }
    clear(){
        this._total = 0;
        this._bids = [];
        this.events.emit(OrderBuilder.TotalChangedEvent, {total: this._total});
    }
}