import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Catalog } from "../models/catalog"
import { CatalogCard } from "./catalogCard";
import { View } from "./view";

export class CatalogView extends View<Catalog>{
    public static EventTopic = "CatalogView";
    private _list: HTMLDivElement;
    constructor(container: HTMLElement, data: Catalog, events: IEvents, private _previewTemplate: HTMLTemplateElement){
        super(container, data, CatalogView.EventTopic, events);
    }
    protected assignDataToContainer(data: Catalog): void {
        this._list = this.container.querySelector(bem("catalog", "items").class);
        this.events.on(Catalog.CatalogChanged, () => this.updateLots());
        this.updateLots();
    }
    private updateLots(){
        this._list.innerHTML = '';
        this.data.getLots().forEach(lot => {
            const lotView = new CatalogCard(CatalogCard.getTemplateElement(this._previewTemplate), lot, this.events);
            this._list.appendChild(lotView.render());
        })
    }
    protected getClickedData() {
        return this.data;
    }
}   