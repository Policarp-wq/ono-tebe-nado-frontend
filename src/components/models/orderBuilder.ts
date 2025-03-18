import { IBasketBidActiveCheckInfo, IOrder, IOrderForm } from "../../types";
import { IEvents } from "../base/events";

export class OrderBuilder{
    private  _bids: IBasketBidActiveCheckInfo[];
    private _total = 0;
    private _orderForm: IOrderForm;
    public static TotalChangedEvent = "order:total_changed";
    constructor(public events: IEvents){
        this._bids = [];
        this._orderForm = {
            email: "",
            phone: ""
        }
    }
    public isEmpty = () => this._bids.length == 0;
    addBid(bid: IBasketBidActiveCheckInfo){
        if(this._bids.some(b => b.lotId == bid.lotId)){
            return;
        }
        this._bids.push(bid);
        this._total += bid.price;
        this.events.emit(OrderBuilder.TotalChangedEvent, {total: this._total});
    }
    setOrderField(field: keyof IOrderForm, value: string){
        this._orderForm[field] = value;
    }
    isValid() : boolean{
        return this._orderForm.email.includes('@') && this._orderForm.email.length > 2 && this._orderForm.phone.length > 0;
    }
    removeBid(bid: IBasketBidActiveCheckInfo){
        if(!this._bids.some(b => b.lotId == bid.lotId)){
            return;
        }
        this._bids = this._bids.filter(b => b.lotId != bid.lotId);
        this._total -= bid.price;
        this.events.emit(OrderBuilder.TotalChangedEvent, {total: this._total});
    }
    build() : IOrder{
        return {
            items: this._bids.map(b => b.lotId),
            email: this._orderForm.email,
            phone: this._orderForm.phone
        }
    }
    clear(){
        this._total = 0;
        this._bids = [];
        this.events.emit(OrderBuilder.TotalChangedEvent, {total: this._total});
        this._orderForm.email = '';
        this._orderForm.phone = '';
    }
}