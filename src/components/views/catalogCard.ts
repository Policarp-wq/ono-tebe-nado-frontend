import { ILotCard, LotStatus, LotUpdate } from "../../types";
import { bem, dayjs } from "../../utils/utils";
import { IEvents } from "../base/events";
import { View } from "./view";

export class CatalogCard extends View<ILotCard>{
    private _image: HTMLImageElement;
    private _status: HTMLDivElement;
    private _title: HTMLHeadingElement;
    private _description: HTMLParagraphElement;
    private _makeBid: HTMLButtonElement;
    private static _statusPhrases = {
        "wait": "Откроется",
        "active": "Открыто до",
        "closed": "Закрыто"
    }

    public static EventTopic = "catalog_card";
    public static OpenCard = this.EventTopic + ":" + "make_bid"
    public static CardChanged = this.EventTopic + "card_changed";

    constructor(container: HTMLElement, data: ILotCard, events: IEvents){
        super(container, data, CatalogCard.EventTopic, events);
        this.updateCard();
        
    }

    private updateCard(){
        this.setText(this._title, this.data.title);
        this.setImage(this._image, this.data.image, "card image");
        this.setStatus(this.data.status);
        this.setText(this._description, this.data.about);
    }

    protected assignDataToContainer(data: ILotCard): void {
        this._image = this.container.querySelector(bem("card", "image").class);
        this._status = this.container.querySelector(bem("card", "status").class);
        this._title = this.container.querySelector(bem("card", "title").class);
        this._description = this.container.querySelector(bem("card", "description").class);
        this._makeBid = this.container.querySelector(bem("card", "action").class);
        this._makeBid.addEventListener('click', () => {
            this.events.emit(CatalogCard.OpenCard, this.data)
        })
        this.events.on("lot:updated" + "_" + this.data.id, (info : LotUpdate) => {
            this.data = { ...this.data, ...info };
            this.updateCard()
        })
    }

    private setStatus(status: LotStatus){
        this._status.classList.remove(bem("card", "status", "active" as LotStatus).name)
        this._status.classList.remove(bem("card", "status", "closed" as LotStatus).name)
        this._status.classList.remove(bem("card", "status", "wait" as LotStatus).name)

        this._status.classList.add(bem("card", "status", status).name);
        this.setText(this._status, this.getStatusText(status));
    }

    private getStatusText(status: LotStatus) : string {
        return `${CatalogCard._statusPhrases[status]} ${dayjs(this.data.datetime).format("D MMMM HH:mm")}`;
    }

    protected getClickedData() {
        return this.data;
    }
}