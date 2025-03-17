import { IBasketBid } from "../../../types";
import { bem } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { BasketBid } from "./basketBidbase";

export class BasketBidActive extends BasketBid{
    private _open: HTMLButtonElement;
    public static BasketBidOpen = BasketBidActive.EventTopic + ":" + "open"
    constructor(container: HTMLElement, data: IBasketBid, events: IEvents){
        super(container, data, events);
        this.addCheckboxListener();
    }
    private addCheckboxListener(){
        this._open = this.container.querySelector(bem("bid", "open").class);
        this._open.addEventListener('click', () => {
            this.events.emit(BasketBidActive.BasketBidOpen, {id: this.data.lotId});
        })
    }


}