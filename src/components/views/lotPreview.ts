import { ILot, LotUpdate } from "../../types";
import { bem, dayjs } from "../../utils/utils";
import { IEvents } from "../base/events";
import { AuctionView } from "./auctionView";
import { View } from "./view";

export class LotPreview extends View<ILot>{
    public static EventTopic = "lot_card_view";
    private _image: HTMLImageElement;
    private _title: HTMLHeadingElement;
    private _description: HTMLParagraphElement;
    private _status: HTMLDivElement;
    private _acutionText: HTMLDivElement;
    private _timer: HTMLSpanElement;
    private _auction : AuctionView;

    public static MakeBidEvent = this.EventTopic + ":" + "make_bid";

    public static LotUpdated = this.EventTopic + ":" + "updated";
    constructor(container: HTMLElement, data: ILot, events: IEvents, private _auctionTemplate: HTMLTemplateElement){
        super(container, data, LotPreview.EventTopic, events);
        this.setAuction(data);
    }

    protected assignDataToContainer(data: ILot): void {
        this._image = this.container.querySelector(bem("lot", "image").class);
        // this._status = this.container.querySelector(bem("lot", "status").class);
        this._title = this.container.querySelector(bem("lot", "title").class);
        this._description = this.container.querySelector(bem("lot", "description").class);
        this._timer = this.container.querySelector(bem("lot", "auction-timer").class);
        this._acutionText = this.container.querySelector(bem("lot", "auction-text").class);
        this._status = this.container.querySelector(bem("lot", "status").class);

        this.setText(this._title, data.title);
        this.setImage(this._image, data.image, "card image");
        this.setText(this._description, data.description); 
        this.setText(this._timer, this.getTimerText(data.datetime));
        if(data.status == "wait")
            this.setText(this._acutionText, "До начала аукциона");
        else if(data.status == "active")
            this.setText(this._acutionText, "До закрытия аукциона");
        else{
            this.setText(this._acutionText, `Продано за ${data.price}`);
        }

        this.events.on(AuctionView.MakeBidEvent, (info) => {
            const bid = data as {price: number, id: string};
            if(this.data.id != bid.id)
                return;
            this.events.emit(LotPreview.MakeBidEvent, {price: bid.price, lot: this.data})
        })

        this.events.on(LotPreview.LotUpdated, (info) => {
            if(this.data.id == (info as LotUpdate)?.id)
                this.update(info as LotUpdate);
        })

    }
    private setAuction(data: ILot) {
        if(data.status != "active")
            return;
        this._auction = new AuctionView(AuctionView.getTemplateElement(this._auctionTemplate), data, this.events);
        this._status.append(...(this._auction.render().children));
    }

    public update(info: LotUpdate){
        this._auction.updateHistory(info.history);
        this.setText(this._timer, this.getTimerText(info.datetime));
    }

    private getTimerText(date: string) : string {
        if(this.data.status == "closed")
            return "Аукцион завершён"
        const now = dayjs("2023-01-08T15:00:25.743Z");
        const end = dayjs(date);
        const diff = end.diff(now);
        const durationObj = dayjs.duration(diff);

        const days = durationObj.days();
        const hours = durationObj.hours();
        const minutes = durationObj.minutes();
        const seconds = durationObj.seconds();

        return `${days}д ${hours}ч ${minutes} мин ${seconds} сек`;
    }

    protected getClickedData() {
        return this.data;
    }
}