import { IBasketBid } from "../../types";
import { IEvents } from "../base/events";
import { View } from "./view";

export class BasketBidView extends View<IBasketBid>{
    
    public static EventsTopic = "basket_bid_view";
    constructor(container: HTMLElement, data: IBasketBid, events: IEvents){
        super(container, data, BasketBidView.EventsTopic, events);
    }
    protected assignDataToContainer(data: IBasketBid): void {
        
    }
}