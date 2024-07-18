import { Injectable } from '@angular/core';
import { ViewChild } from '@angular/core';

interface DroppedItem {
  positionX: number;
  positionY: number;
  content: any;
}
@Injectable({
  providedIn: 'root'
})
export class DroppedItemsService {

  private droppedItems: DroppedItem[] = [];

  setDroppedItems(items: DroppedItem[]): void {
    this.droppedItems = items;
  }

  getDroppedItems(): DroppedItem[] {
    return this.droppedItems;
  }

}