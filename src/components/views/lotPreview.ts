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
    private _auctionText: HTMLDivElement;
    private _timer: HTMLSpanElement;
    private _auction : AuctionView;

    public static MakeBidEvent = this.EventTopic + ":" + "make_bid";

    public static LotUpdated = this.EventTopic + ":" + "updated";
    constructor(container: HTMLElement, data: ILot, events: IEvents, private _auctionTemplate: HTMLTemplateElement){
        super(container, data, LotPreview.EventTopic, events);
        this.updatePresentation();
    }

    protected assignDataToContainer(data: ILot): void {
        this._image = this.container.querySelector(bem("lot", "image").class);
        // this._status = this.container.querySelector(bem("lot", "status").class);
        this._title = this.container.querySelector(bem("lot", "title").class);
        this._description = this.container.querySelector(bem("lot", "description").class);
        this._timer = this.container.querySelector(bem("lot", "auction-timer").class);
        this._auctionText = this.container.querySelector(bem("lot", "auction-text").class);
        this._status = this.container.querySelector(bem("lot", "status").class);

        this.setText(this._title, data.title);
        this.setImage(this._image, data.image, "card image");
        this.setText(this._description, data.description); 
        this.setText(this._timer, this.getTimerText(data.datetime));
        this.events.on(AuctionView.MakeBidEvent, (info) => {
            const bid = info as {price: number, id: string};
            if(this.data.id != bid.id)
                return;
            this.events.emit(LotPreview.MakeBidEvent, {price: bid.price, lot: this.data})
        })
        this.events.on(LotPreview.LotUpdated + ":" + this.data.id, (info) => {
            console.log("Updating lot " + this.data.id);
            this.updateData(info as LotUpdate)
        })

    }

    private updateData(info: LotUpdate){
        this.data = { ...this.data, ...info };
        this.updatePresentation();
    }
    private setAuction() {
        if(this.data.status != "active"){
            const auctStatus = this._status.querySelector(".lot__status");
            if(auctStatus)
                this._status.removeChild(auctStatus);
            return;
        }
        this._auction = new AuctionView(AuctionView.getTemplateElement(this._auctionTemplate), this.data, this.events);
        // this._auction.updateHistory(this.data.history);
        this._status.append(this._auction.render());
    }


    public updatePresentation(){
        this.setAuction();
        if(this.data.status == "wait")
            this.setText(this._auctionText, "До начала аукциона");
        else if(this.data.status == "active")
            this.setText(this._auctionText, "До закрытия аукциона");
        else{
            this.setText(this._auctionText, `Продано за ${this.data.price}`);
        }
        this.setText(this._timer, this.getTimerText(this.data.datetime));
    }

    private getTimerText(date: string) : string {
        if(this.data.status == "closed")
            return "Аукцион завершён"
        const now = dayjs();
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