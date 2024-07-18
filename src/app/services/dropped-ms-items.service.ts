import { Injectable } from '@angular/core';


interface Droppedchart {
  positionX: number;
  positionY: number;
  chart:String;

} 
interface MsDroppedColumns{
  id:number;
  column:Droppedchart;
}

@Injectable({
  providedIn: 'root'
})
export class DroppedMsItemsService {

  constructor() { }

  private droppedMsItems!:MsDroppedColumns[];
  
  setDroppedMsItems(items: MsDroppedColumns): void {
    if (!this.droppedMsItems) {
      this.droppedMsItems = [];
    }
    this.droppedMsItems.push(items);
  }
  getDroppedMsItems():MsDroppedColumns[]{
    return this.droppedMsItems;
  }

}
