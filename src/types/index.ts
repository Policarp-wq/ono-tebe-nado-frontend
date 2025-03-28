export type LotStatus = 'wait' | 'active' | 'closed';

export interface IAuction {
    id: string;
    status: LotStatus;
    datetime: string;
    price: number;
    minPrice: number;
    history?: number[];
}

export interface ILotItem {
    id: string;
    title: string;
    about: string;
    description?: string;
    image: string;

}

export interface ITabState{
    state: string;
}

export interface ILotCard extends ILotItem{ 
    status: LotStatus,
    datetime: string;
}

export interface IBasketBid{
    lotId: string,
    image: string
    title: string,
    lastPrice: number,
    lastPriceByCurrentUser: boolean
    closed: boolean
}

export interface IBasketBidActiveCheckInfo {
    checked: boolean,
    lotId: string,
}

export type ILot = ILotItem & IAuction;

export type LotUpdate = Pick<ILot, 'id' | 'datetime' | 'status' | 'price' | 'history'>;

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IBid {
    price: number
}

export interface IOrderResult {
    id: string;
}