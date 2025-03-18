import { forEach } from "lodash";
import { IBasketBid } from "../../types";
import { Model } from "../base/Model";
import { IEvents } from "../base/events";

export class Basket extends Model{
    private _bids: IBasketBid[];
    private _orderList: IBasketBid[];
    private _totalOrder = 0;
    public static EventTopic = "basket";
    public static BasketChanged = Basket.EventTopic + ":" + "changed";
    public static OrderListChanged = Basket.EventTopic + ":" + "order_changed";
    constructor(events: IEvents){
            super(events);
            this._bids = [];
            this._orderList = [];
        }
    public clearActive(){
        this._bids = this._bids.filter(b => !b.closed);
        this.events.emit(Basket.BasketChanged, this._bids);
    }
    public addToOrderList(id: string){
        if(this._orderList.some(o => o.lotId == id))
            return;
        let adding : IBasketBid;
        this._bids.forEach(element => {
            if(element.lotId == id)
                adding = element;
        });
        if(!adding)
            return;
        this._totalOrder += adding.lastPrice;
        this._orderList.push(adding);
        this.events.emit(Basket.OrderListChanged, this._orderList);
    }
    public removeFromOrder(id: string){
        if(!this._orderList.some(o => o.lotId == id))
            return;
        let removing : IBasketBid;
        this._orderList.forEach(element => {
            if(element.lotId == id){
                removing = element;
            }
        });
        this._totalOrder -= removing.lastPrice;
        this._orderList = this._orderList.filter(o => o.lotId != id); 
        this.events.emit(Basket.OrderListChanged, this._orderList);
    }
    public addBid(bid: IBasketBid){
        for(let i = 0; i < this._bids.length; ++i){
            if(this._bids[i].lotId == bid.lotId){
                this._bids[i] = bid;
                return;
            }
        }
        this._bids.push(bid);
        this.events.emit(Basket.BasketChanged, this._bids);
    }

    public getTotal() : number{
        return this._totalOrder;
    }

    public isOrderValid(){
        return this._orderList.length > 0;
    }

    public getOrderItems() : string[]{
        return this._orderList.map(o => o.lotId);
    }

    public getActiveBids(): IBasketBid[] {
        return this._bids.filter(b => !b.closed);
    }

    public getClosedBids(): IBasketBid[] {
        return this._bids.filter(b => b.closed);
    }

    public containsLotAsClosed(id: string){
        return this._bids.some(b => b.lotId == id)
    }

    public getBids(): IBasketBid[]{
        return this._bids;
    }
}