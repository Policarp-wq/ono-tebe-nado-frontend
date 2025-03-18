import { IBasketBidActiveCheckInfo, IOrder, IOrderForm } from "../../types";
import { IEvents } from "../base/events";

export class OrderBuilder{
    private  _bids: string[];
    private _orderForm: IOrderForm;
    public static TotalChangedEvent = "order:total_changed";
    constructor(public events: IEvents){
        this._bids = [];
        this._orderForm = {
            email: "",
            phone: ""
        }
    }
    
    setOrderField(field: keyof IOrderForm, value: string){
        this._orderForm[field] = value;
    }
    isValid() : boolean{
        return this._orderForm.email.includes('@') && this._orderForm.email.length > 2 && this._orderForm.phone.length > 0;
    }

    setBids(bids: string[]){
        this._bids = bids;
    }
    
    build() : IOrder{
        return {
            items: this._bids,
            email: this._orderForm.email,
            phone: this._orderForm.phone
        }
    }
    clear(){
        this._bids = [];
        this._orderForm.email = '';
        this._orderForm.phone = '';
    }
}