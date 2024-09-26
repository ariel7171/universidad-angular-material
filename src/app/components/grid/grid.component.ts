import { Component, effect, EventEmitter, inject, input, OnInit, Output, signal, viewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FilterComponent } from "./filter/filter.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { SharingService } from '@shared/services/sharing-service';

const MATERIAL_MODULES = [MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule];

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [MATERIAL_MODULES, FilterComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})

export class GridComponent<T> implements OnInit {

  @Output() opendEditFormChild = new EventEmitter<T>();

  @Output() deleteElementChild = new EventEmitter<T>();

  displayedColumns = input.required<any[]>();
  //data = input.required<T[]>();

  data$!: Observable<T[]>
  dataSource = new MatTableDataSource<T>();
  valueToFilter = signal('');

  private readonly _sort = viewChild.required<MatSort>(MatSort);
  private readonly _paginator = viewChild.required<MatPaginator>(MatPaginator);
  private readonly _sharingSvc = inject(SharingService);

  constructor() {

    effect(() => {
      if (this.valueToFilter()) {
        this.dataSource.filter = this.valueToFilter();
      } else {
        this.dataSource.filter = '';
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.data$ = this._sharingSvc.getlistaTablaObservable();
    //this.dataSource.data = this.data$;
    this.data$.subscribe(data => this.dataSource.data = data);
    this.dataSource.sort = this._sort();
    this.dataSource.paginator = this._paginator();
  }

  openEditForm(element: T): void {
    this.opendEditFormChild.emit(element);
  }

  deleteElement(element: T) {
    this.deleteElementChild.emit(element);
  }

}