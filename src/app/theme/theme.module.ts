import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { SidebarNoticeComponent } from './sidebar-notice/sidebar-notice.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserPanelComponent } from './sidebar/user-panel.component';
import { TopmenuComponent } from './topmenu/topmenu.component';
import { TopmenuPanelComponent } from './topmenu/topmenu-panel.component';

import { BrandingComponent } from './widgets/branding.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AuthLayoutComponent,
    HeaderComponent,
    SidemenuComponent,
    SidebarComponent,
    UserPanelComponent,
    SidebarNoticeComponent,
    TopmenuComponent,
    TopmenuPanelComponent,
    BrandingComponent,
  ],
  imports: [SharedModule],
})
export class ThemeModule {}
