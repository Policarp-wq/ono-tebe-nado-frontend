import { forEach } from "lodash";
import { IBasketBid } from "../../types";
import { Model } from "../base/Model";
import { IEvents } from "../base/events";

export class Basket extends Model{
    private bids: IBasketBid[];
    public static EventTopic = "basket";
    public static BasketChanged = Basket.EventTopic + ":" + "changed";
    constructor(events: IEvents){
            super(events);
            this.bids = [];
        }
    public clearActive(){
        this.bids = this.bids.filter(b => !b.closed);
        this.events.emit(Basket.BasketChanged, this.bids);
    }
    public addBid(bid: IBasketBid){
        for(let i = 0; i < this.bids.length; ++i){
            if(this.bids[i].lotId == bid.lotId){
                this.bids[i] = bid;
                return;
            }
        }
        this.bids.push(bid);
        this.events.emit(Basket.BasketChanged, this.bids);
    }

    public getActiveBids(): IBasketBid[] {
        return this.bids.filter(b => !b.closed);
    }

    public getClosedBids(): IBasketBid[] {
        return this.bids.filter(b => b.closed);
    }

    public containsLotAsClosed(id: string){
        return this.bids.some(b => b.lotId == id)
    }

    public getBids(): IBasketBid[]{
        return this.bids;
    }
}