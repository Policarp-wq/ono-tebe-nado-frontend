import { IBasketBid } from "../../types";
import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket } from "../models/basket";
import { View } from "./view";

export interface IBidTemplates{
    activeBid: HTMLTemplateElement,
    closedBid: HTMLTemplateElement,
}

export class BasketView extends View<Basket>{
    private _bidsList: HTMLDivElement;

    public static EventsTopic = "basket_view";
    private _state: "active" | "closed" = "closed"; 
    constructor(container: HTMLElement, data: Basket, events: IEvents,
            private _tabs: HTMLElement,
            private _templates: IBidTemplates,
            private _emptyState: HTMLElement){
        super(container, data, BasketView.EventsTopic, events);
        this.container.insertBefore(this._tabs, this._bidsList);
    }
    protected assignDataToContainer(data: Basket): void {
        this._bidsList = this.container.querySelector(bem("basket", "list").class);
        this.events.on(Basket.BasketChanged, bid => this.updateView())
        this.fillList();
    }

    private updateView(){
        // if(this.data.getBids().length == 0)
        //     this.setEmptyView();
        // else if(this._state == "active")
        //     this.setActiveView();
        // else this.setClosedView();
    }

    private setEmptyView(){
        this.setHidden(this._bidsList);
        this.setVisible(this._emptyState);
    }


    private fillList(){
        // if(this._state == "active")
        //     this.fillActive
    }

}