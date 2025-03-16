import { IAuction, IBid, LotUpdate } from "../../types";
import { bem, createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";
import { View } from "./view";

export class AuctionView extends View<IAuction> {
    private _text: HTMLSpanElement;
    private _form: HTMLFormElement;
    private _history: HTMLUListElement;
    private _priceInput: HTMLInputElement;

    public static EventsTopic = "auction_view";
    public static MakeBidEvent = this.EventsTopic + ":" + "make_bid";
    constructor(container: HTMLElement, data: IAuction, events: IEvents){
        super(container, data, AuctionView.EventsTopic, events);
    }

    protected assignDataToContainer(data: IAuction): void {
        // maybe will lot__status lot__status overlap in html 313
 
        this._text = this.container.querySelector(bem("lot", "auction-text").class);
        this._history = this.container.querySelector(bem("lot", "history-bids").class);

        this._form = this.container.querySelector(bem("lot", "bid").class);
        this._priceInput = this._form.querySelector(bem("form", "input").class);
        this._form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const val = this._priceInput.value;
            if(Number.parseInt(val) && this.isValidPrice(Number.parseInt(val))){
                this.makeBid(Number.parseInt(val));
            }
            else alert("Wrong bid");
        })
        this.updateHistory(data.history);
    }
    
   

    public updateHistory(history?: number[]){
        if(history)
            this._history.innerHTML = '';
        history?.forEach(b => {
            let item = createElement<HTMLLIElement>("li");
            item.classList.add(bem("lot", "history").name);
            item.textContent = b.toString();
            this._history.appendChild(item);
        })
    }

    private makeBid(price: number){
        this.events.emit(AuctionView.MakeBidEvent, {price: price, id: this.data.id});
        this._priceInput.value = "";
    }

    private isValidPrice(price: number){
        return price >= this.data.minPrice;
    }

}