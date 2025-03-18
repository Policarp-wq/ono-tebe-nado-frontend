import { IBasketBid, IBasketBidActiveCheckInfo } from "../../../types";
import { bem } from "../../../utils/utils";
import { IEvents } from "../../base/events";
import { BasketBid } from "./basketBidbase";

export class BasketBidClosed extends BasketBid{
    private _checkbox: HTMLInputElement;
    public static BasketBidCheckChanged = BasketBidClosed.EventTopic + ":" + "check_changed"
    constructor(container: HTMLElement, data: IBasketBid, events: IEvents){
        super(container, data, events);
        this.addCheckboxListener();
    }
    private addCheckboxListener(){
        this._checkbox = this.container.querySelector(bem("bid", "selector-input").class);
        this._checkbox.addEventListener('change', () => this.checkboxChanged());
    }

    private checkboxChanged(){
        const info: IBasketBidActiveCheckInfo = {
            checked: this._checkbox.checked,
            lotId: this.data.lotId
        }
        this.events.emit(BasketBidClosed.BasketBidCheckChanged, info);
    }
}


