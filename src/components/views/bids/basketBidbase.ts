import { IBasketBid } from "../../../types";
import { bem } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { View } from "../view";

export class BasketBid extends View<IBasketBid>{
    private _image: HTMLImageElement
    private _title: HTMLHeadingElement;
    private _amount: HTMLSpanElement;
    public static EventTopic = "basket_bid";
    constructor(container: HTMLElement, data: IBasketBid, events: IEvents){
        super(container, data, BasketBid.EventTopic, events);
    }
    protected assignDataToContainer(data: IBasketBid): void {
        this._image = this.container.querySelector(bem("bid", "image").class)
        this._title = this.container.querySelector(bem("bid", "title").class)
        this._amount = this.container.querySelector(bem("bid", "amount").class)

        this.setImage(this._image, data.image, data.title);
        this.setText(this._title, data.title);
        this.setText(this._amount, data.lastPrice);
    }
}