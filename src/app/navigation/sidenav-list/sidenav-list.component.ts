import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
