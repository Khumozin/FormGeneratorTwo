import {
    CdkDrag,
    CdkDragDrop,
    CdkDragExit,
    CdkDropList,
    DragDropModule,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

type FormFieldType = 'text' | 'select' | 'checkbox' | 'radio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DragDropModule,
    NgFor,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'FormGeneratorTwo';

  controls = [
    {
      id: crypto.randomUUID(),
      title: 'Text',
      type: 'text',
      columnCount: 1,
      controlWidth: 3,
    },
    {
      id: crypto.randomUUID(),
      title: 'Number',
      type: 'text',
      columnCount: 1,
      controlWidth: 3,
    },
    {
      id: crypto.randomUUID(),
      title: 'Select',
      type: 'select',
      columnCount: 1,
      controlWidth: 3,
      options: [
        {
          key: crypto.randomUUID(),
          value: 'Male',
        },
        {
          key: crypto.randomUUID(),
          value: 'Female',
        },
        {
          key: crypto.randomUUID(),
          value: 'Other',
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'Checkbox',
      type: 'checkbox',
      columnCount: 1,
      controlWidth: 3,
      isChecked: false,
    },
    {
      id: crypto.randomUUID(),
      title: 'Radio',
      type: 'radio',
      columnCount: 1,
      controlWidth: 3,
      options: [
        {
          key: crypto.randomUUID(),
          value: 'Male',
        },
        {
          key: crypto.randomUUID(),
          value: 'Female',
        },
        {
          key: crypto.randomUUID(),
          value: 'Other',
        },
      ],
    },
  ];
  done: any[] = [];
  DropListConnectedTo: string[] = [];

  ngOnInit(): void {
    this.getDropListConnections();
  }

  doneListExited(event: CdkDragExit<any[]>) {
    let index = this.DropListConnectedTo.findIndex(
      (item: any) => item == 'doneList'
    );
    if (index !== -1) {
      this.DropListConnectedTo.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer.id === 'controls') {
      this.addNewFieldToList(
        event.currentIndex,
        event.previousContainer.data[event.previousIndex],
        event.container.data
      );
    } else {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
    this.done = this.done.map((item) => {
      if (Array.isArray(item)) {
        return item;
      } else {
        return [item];
      }
    });
    this.done = this.done.filter((subArray: any) => subArray.length > 0);
    this.getDropListConnections();
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate(drag: CdkDrag, drop: CdkDropList) {
    return drop.data.length >= 3 ? false : true;
    // return item.data.length>3;
  }

  dragEntered(event: CdkDragExit<any[]>) {
    // This method is called when dragging enters a container
    const targetContainerId = event.container.id;
    this.addDropList();
  }

  addDropList() {
    this.DropListConnectedTo.push('doneList');
  }

  getDropListConnections() {
    this.DropListConnectedTo = [];
    if (this.done.length > 0) {
      for (let i = 0; i < this.done.length; i++) {
        this.DropListConnectedTo.unshift(`droplist-${i}`);
      }
    }
    this.DropListConnectedTo.push('doneList');
  }

  addNewFieldToList(index: number, _field: any, list: any[]) {
    let field: any = _field;

    list.splice(index, 0, field);
  }
}
