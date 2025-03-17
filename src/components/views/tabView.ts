import { ITabState } from "../../types";
import { bem } from "../../utils/utils";
import { IEvents } from "../base/events";
import { View } from "./view";

export class TabView extends View<ITabState[]>{
    public static EventTopic = "tab_view";
    public TabSelected = TabView.EventTopic + "_" + this.tabGroupName + ":" + "tab_selected";
    private _current : HTMLButtonElement;
    constructor(container: HTMLElement, data: ITabState[], events: IEvents, public tabGroupName: string){
        super(container, data, TabView.EventTopic, events);
    }

    protected assignDataToContainer(data: ITabState[]): void {
        const buttons: NodeListOf<HTMLButtonElement> = this.container.querySelectorAll(bem("button").class);
        buttons.forEach((btn) => {
            const button = btn as HTMLButtonElement;
            if(data.some(state => state.state == button.name)){
                console.log("assigned listener for tab " + button.name)
                button.addEventListener('click', () => {
                    console.log("clicked on " + button.name)
                    this.onTabSelected(button);
                    this.events.emit(this.TabSelected, {state: button.name} as ITabState);
                })
            }
        });
    }
    private getButtonByState(state: ITabState): HTMLButtonElement{
        const buttons: NodeListOf<HTMLButtonElement> = this.container.querySelectorAll(bem("button").class);
        let res: HTMLButtonElement; 
        buttons.forEach(element => {
            if(element.name == state.state){
                res = element;
            }
        });
        return res;
    }
    public setState(state: ITabState){
        this.onTabSelected(this.getButtonByState(state));
    }
    private onTabSelected(button?: HTMLButtonElement){
        if(!button)
            return;
        if(this._current){
            this._current.classList.remove("tabs__item_active");
            this._current.disabled = false;
        }     
        this._current = button;
        this._current.classList.add("tabs__item_active");
        this._current.disabled = true;
    }
}