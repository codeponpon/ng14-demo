import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MenuService } from '@core/bootstrap/menu.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidemenuComponent {
  // NOTE: Ripple effect make page flashing on mobile
  @Input() ripple = true;

  menu$ = this.menu.getAll();
  buildRoute = this.menu.buildRoute;

  constructor(private menu: MenuService) {}
}
