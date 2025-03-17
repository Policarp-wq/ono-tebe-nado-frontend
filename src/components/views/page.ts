import { IBasketBid } from "../../types";
import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket } from "../models/basket";
import { View } from "./view";

export class Page extends View<null> {
    public static EventTopic = "page";
    private _wrapper: HTMLDivElement;
    private _basketCounter: HTMLSpanElement;
    constructor(container: HTMLElement, events: IEvents){
        super(container, null, Page.EventTopic, events);
    }
    protected assignDataToContainer(data: null): void {
        this._wrapper = this.container.querySelector(bem("page", "wrapper").class);
        this._basketCounter = this.container.querySelector(bem("header", "basket-counter").class);
        this.events.on("modal:open", () => {
            this.lock(true);
        })
        this.events.on("modal:close", () => {
            this.lock(false);
        })
        this.events.on(Basket.BasketChanged, (info) => {
            this._basketCounter.textContent = (info as IBasketBid[]).length.toString();
        })
    }
    private lock(val: boolean){
        if (val) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}