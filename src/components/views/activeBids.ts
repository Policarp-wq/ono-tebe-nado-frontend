import { IBasketBid } from "../../types";
import { IEvents } from "../base/events";
import { View } from "./view";

export class ActiveBids extends View<IBasketBid>{
    public static EventTopic = "active_bids";
    constructor(container: HTMLElement, data: IBasketBid, events: IEvents){
        super(container, data, ActiveBids.EventTopic, events);
    }
    protected assignDataToContainer(data: IBasketBid): void {
        
    }
}