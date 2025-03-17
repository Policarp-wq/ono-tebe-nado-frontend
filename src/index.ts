import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { Model } from './components/base/Model';
import { extend } from 'lodash';
import { IBasketBid, IBasketBidActiveCheckInfo, IBid, ILot, ILotCard, IOrderForm, ITabState } from './types';
import { dayjs, ensureElement } from './utils/utils';
import { CatalogView } from './components/views/catalogView';
import { Catalog } from './components/models/catalog';
import { CatalogCard } from './components/views/catalogCard';
import { Modal } from './components/common/Modal';
import { LotPreview } from './components/views/lotPreview';
import { AuctionView } from './components/views/auctionView';
import { Basket } from './components/models/basket';
import { TabView } from './components/views/tabView';
import { BasketView, IBidTemplates } from './components/views/basketView';
import { View } from './components/views/view';
import { BasketBidActive } from './components/views/bids/basketBidActive';
import { Page } from './components/views/page';
import { BasketBidClosed } from './components/views/bids/basketBidClosed';
import { OrderBuilder } from './components/models/orderBuilder';
import { Form } from './components/common/Form';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})


// Все шаблоны
const templates = {
    tabTemplate: ensureElement<HTMLTemplateElement>("#tabs"),
    emptyStateTemplate: ensureElement<HTMLTemplateElement>("#empty"),
    activeBidTemplate: ensureElement<HTMLTemplateElement>("#bid"),
    closedBidTemplate: ensureElement<HTMLTemplateElement>("#sold"),
    basketTemplate: ensureElement<HTMLTemplateElement>("#basket"),
    cardTemplate: ensureElement<HTMLTemplateElement>("#card"),
    previewTemplate: ensureElement<HTMLTemplateElement>("#preview"),
    auctionTemplate: ensureElement<HTMLTemplateElement>("#auction"),
    orderFormTemplate: ensureElement<HTMLTemplateElement>("#order")
}
// Модель данных приложения
const orderBuilder = new OrderBuilder(events);

// Глобальные контейнеры
const modalContainer = ensureElement<HTMLDivElement>("#modal-container");
const modal = new Modal(modalContainer, events)
const emptyState = View.getTemplateElement(templates.emptyStateTemplate);
(emptyState.querySelector(".button") as HTMLButtonElement).addEventListener('click', () =>{
    events.emit("empty:go_main");
})
const page = new Page(ensureElement<HTMLElement>(".page"), events);
// Переиспользуемые части интерфейса
const orderForm = new Form<IOrderForm>(View.getTemplateElement(templates.orderFormTemplate) as HTMLFormElement, events)

const tabs = TabView.getTemplateElement(templates.tabTemplate);
const tabsView = new TabView(tabs, [{state: "active"}, {state: "closed"}] as ITabState[], events, "basket_tabs");
const basket = new Basket(events);

const basketView = new BasketView(
    BasketView.getTemplateElement(templates.basketTemplate),
        basket,
        events,
        {
            activeBid: templates.activeBidTemplate,
            closedBid: templates.closedBidTemplate,
        } as IBidTemplates,
        tabsView,
        emptyState
);
const basketHeaderElement = ensureElement<HTMLButtonElement>(".header__basket");
basketHeaderElement.addEventListener('click', () => {
    modal.content = basketView.render();
    modal.open();
})
const catalogContainer = ensureElement<HTMLElement>(".catalog");
const catalog = new Catalog(events);
const catalogView = new CatalogView(catalogContainer, catalog, events, templates.cardTemplate);
// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

function openCard(id: string){

    api.getLotItem(id).then(res => {
        if(basket.containsLotAsClosed(id))
            res.status = "closed";
        const lotView = new LotPreview(LotPreview.getTemplateElement(templates.previewTemplate), res, events, templates.auctionTemplate);
        modal.content = lotView.render();
        modal.open();
    })
}

events.on(CatalogCard.OpenCard, (data) => {
    const info = data as ILotCard
    openCard(info.id);
})


events.on(LotPreview.MakeBidEvent, (data) => {
    const bid = data as {price: number, lot: ILot};
    api.placeBid(bid.lot.id, {price: bid.price} as IBid)
        .then(upd => {
            console.log(upd);
            upd.status = "closed"
            events.emit(LotPreview.LotUpdated + ":" + upd.id, upd);
            let basketBid: IBasketBid = {
                lotId: bid.lot.id,
                title: bid.lot.title,
                lastPrice: bid.price,
                lastPriceByCurrentUser: true,
                image: bid.lot.image,
                closed: true // weird af
            }
            basket.addBid(basketBid)
        })
})

events.on(BasketBidActive.BasketBidOpen, (info) =>{
    const id = (info as {id: string}).id;
    openCard(id);
})

events.on("empty:go_main", () =>{
    modal.close();
})

events.on("order:abandon", () => {
    orderBuilder.clear();
})

events.on(BasketBidClosed.BasketBidCheckChanged, (info) => {
    const inf = info as IBasketBidActiveCheckInfo;
    if(inf.checked)
        orderBuilder.addBid(inf);
    else orderBuilder.removeBid(inf);
}
);


// Получаем лоты с сервера
api.getLotList()
    .then(result => {
        catalog.addLots(result)
        console.log(result);
    })
    .catch(err => {
        console.error(err);
    });


