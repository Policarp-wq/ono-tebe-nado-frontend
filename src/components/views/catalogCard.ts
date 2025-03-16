import { ILotCard, LotStatus } from "../../types";
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

    constructor(container: HTMLElement, data: ILotCard, events: IEvents){
        super(container, data, CatalogCard.EventTopic, events);
    }
    protected assignDataToContainer(data: ILotCard): void {
        this._image = this.container.querySelector(bem("card", "image").class);
        this._status = this.container.querySelector(bem("card", "status").class);
        this._title = this.container.querySelector(bem("card", "title").class);
        this._description = this.container.querySelector(bem("card", "description").class);
        this._makeBid = this.container.querySelector(bem("card", "action").class);

        this.setText(this._title, data.title);
        this.setImage(this._image, data.image, "card image");
        this.setText(this._status, this.getStatusText())
        this.setText(this._description, data.about);

        this._status.classList.add(bem("card", "status", data.status).name);

        this._makeBid.addEventListener('click', () => {
            this.events.emit(CatalogCard.OpenCard, this.data)
        })
    }

    private getStatusText() : string {
        return `${CatalogCard._statusPhrases[this.data.status]} ${dayjs(this.data.datetime).format("D MMMM HH:mm")}`;
    }

    protected getClickedData() {
        return this.data;
    }
}