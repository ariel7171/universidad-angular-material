import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from '@components/modal/modal.component';
import { ModalService } from '@components/modal/modal.service';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';

const MATERIAL_MODULES = [MatCardModule];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, MATERIAL_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly _modalSvc = inject(ModalService);


  // onClickNewEstudiante(): void {
  //   this._modalSvc.openmodal<ModalComponent>(ModalComponent);
  // }
}
