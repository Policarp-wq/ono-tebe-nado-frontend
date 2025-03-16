import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export abstract class View<T> extends Component<T>{
    constructor(container: HTMLElement, protected data: T, protected eventTopic: string, protected events: IEvents){
        super(container);
        this.assignDataToContainer(data);
        container.addEventListener('click', () => this.emitClickedEvent());
    }
    
    static getTemplateElement(template: HTMLTemplateElement) : HTMLElement{
        const element = template.content.firstElementChild.cloneNode(true) as HTMLElement;
        return element;
    }

    private emitClickedEvent(){
        this.events.emit(this.eventTopic + ":clicked", );
    }

    protected getClickedData() : T{
        return this.data;
    }

    protected abstract assignDataToContainer(data: T): void;
}