import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import { Model } from './components/base/Model';
import { extend } from 'lodash';
import { IBasketBid, IBid, ILot, ILotCard } from './types';
import { dayjs, ensureElement } from './utils/utils';
import { CatalogView } from './components/views/catalogView';
import { Catalog } from './components/models/catalog';
import { CatalogCard } from './components/views/catalogCard';
import { Modal } from './components/common/Modal';
import { LotPreview } from './components/views/lotPreview';
import { AuctionView } from './components/views/auctionView';
import { Basket } from './components/models/basket';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})


// Все шаблоны

// Модель данных приложения


// Глобальные контейнеры


// Переиспользуемые части интерфейса
const cardTemplate = ensureElement<HTMLTemplateElement>("#card");
const previewTemplate = ensureElement<HTMLTemplateElement>("#preview");
const auctionTemplate = ensureElement<HTMLTemplateElement>("#auction");

const basket = new Basket(events);
const basketCounter = ensureElement<HTMLSpanElement>(".header__basket-counter");
const catalogContainer = ensureElement<HTMLElement>(".catalog");
const modalContainer = ensureElement<HTMLDivElement>("#modal-container");
const catalog = new Catalog(events);
const catalogView = new CatalogView(catalogContainer, catalog, events, cardTemplate);
const modal = new Modal(modalContainer, events)
// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно
events.on(CatalogCard.OpenCard, (data) => {
    const info = data as ILotCard
    api.getLotItem(info.id).then(res => {
        const lotView = new LotPreview(LotPreview.getTemplateElement(previewTemplate), res, events, auctionTemplate);
        modal.content = lotView.render();
        modal.open();
    })
})

events.on(Basket.BasketChanged, (info) => {
    basketCounter.textContent = (info as {bids: IBasketBid[]}).bids.length.toString();
})

events.on(LotPreview.MakeBidEvent, (data) => {
    const bid = data as {price: number, lot: ILot};
    api.placeBid(bid.lot.id, {price: bid.price} as IBid)
        .then(upd => {
            console.log(upd);
            events.emit(LotPreview.LotUpdated, upd);
            let basketBid: IBasketBid = {lotId: bid.lot.id, title: bid.lot.title, lastPrice: bid.price, lastPriceByCurrentUser: true}
            basket.addBid(basketBid)
        })
})




// Получаем лоты с сервера
api.getLotList()
    .then(result => {
        catalog.addLots(result)
        console.log(result);
    })
    .catch(err => {
        console.error(err);
    });


