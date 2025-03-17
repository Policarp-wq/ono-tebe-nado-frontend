import { IBasketBid, IBasketBidActiveCheckInfo, ITabState } from "../../types";
import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Basket } from "../models/basket";
import { OrderBuilder } from "../models/orderBuilder";
import { BasketBidActive } from "./bids/basketBidActive";
import { BasketBidClosed } from "./bids/basketBidClosed";
import { TabView } from "./tabView";
import { View } from "./view";

export interface IBidTemplates{
    activeBid: HTMLTemplateElement,
    closedBid: HTMLTemplateElement,
}

export type BasketType = "active" | "closed";

export class BasketView extends View<Basket>{
    private _bidsList: HTMLDivElement;
    private _actions: HTMLDivElement;

    private _total: HTMLSpanElement;
    private _order: HTMLButtonElement;
    public static EventsTopic = "basket_view";
    private _state: BasketType = "closed"; 
    public static BasketOrderChanged = this.EventsTopic + ":" + "basket_order_changed";
    public static BasketOrderConfirmEvent = this.EventsTopic + ":" + "basket_order";
    constructor(container: HTMLElement, data: Basket, events: IEvents,
            private _templates: IBidTemplates,
            private _tabs : TabView,
            private _emptyState: HTMLElement){
        super(container, data, BasketView.EventsTopic, events);
        this.container.insertBefore(this._tabs.render(), this._bidsList);
        this.container.insertBefore(this._emptyState, this._bidsList);
        this._tabs.setState({state: this._state} as ITabState)
        this.events.on(this._tabs.TabSelected, (state) => this.onStateUpdated(state as ITabState))
        this.updateView();
    }
    protected assignDataToContainer(data: Basket): void {
        this._bidsList = this.container.querySelector(bem("basket", "list").class);
        this._actions = this.container.querySelector(bem("basket", "actions").class);
        this._total = this._actions.querySelector(bem("basket", "total").class);
        this._order = this._actions.querySelector(bem("basket", "action").class);
        this.events.on(Basket.BasketChanged, bid => this.updateView())
        
        this.events.on(BasketBidClosed.BasketBidCheckChanged, (info) => this.onActiveBidChanged(info as IBasketBidActiveCheckInfo))
        this.events.on(OrderBuilder.TotalChangedEvent, (total) => {
            this.setText(this._total, (total as {total: number}).total);
        })

        this._order.addEventListener('click', () =>{
            this.events.emit(BasketView.BasketOrderConfirmEvent);
        });
    }

    private onActiveBidChanged(info: IBasketBidActiveCheckInfo){
        this.events.emit(BasketView.BasketOrderChanged, info);
    }


    onStateUpdated(state: ITabState): void {
        const newState = state.state as BasketType;
        if(newState == this._state)
            return;
        this._state = newState;
        this.events.emit("order:abandon");
        this.updateView();
    }

    private updateView(){
        if(this._state == "closed" && this.data.getClosedBids().length == 0
            || this._state == "active" && this.data.getActiveBids().length == 0){
            this.setEmptyView();
            return;
        }
        this.removeEmptyView();
        if(this._state == "closed")
            this.setVisible(this._actions);
        else this.setHidden(this._actions);
        this.fillList();
    }
    private removeEmptyView(){
        this.setVisible(this._bidsList);
        this.setHidden(this._emptyState);
    }

    private setEmptyView(){
        this.setHidden(this._bidsList);
        this.setHidden(this._actions);
        this.setVisible(this._emptyState);
    }


    private fillList(){
        this._bidsList.innerHTML = '';
        if(this._state == "active"){
            this.data.getActiveBids().forEach(bid => {
                const bidView: BasketBidActive = new BasketBidActive(
                    BasketBidActive.getTemplateElement(this._templates.activeBid),
                bid, this.events);
                this._bidsList.appendChild(bidView.render());
            })
        }
        else if(this._state == "closed"){
            this.data.getClosedBids().forEach(bid => {
                const bidView: BasketBidClosed = new BasketBidClosed(
                    BasketBidClosed.getTemplateElement(this._templates.closedBid),
                bid, this.events);
                this._bidsList.appendChild(bidView.render());
            })
        }
    }

}

