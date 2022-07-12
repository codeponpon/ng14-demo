import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="matero-branding" href="/">
      <img src="./assets/images/dpm_ic.svg" class="matero-branding-logo-expanded" alt="logo" />
      <img src="./assets/images/pm_txt.svg" class="matero-branding-logo-expanded" alt="logo" />
    </a>
  `,
})
export class BrandingComponent {}
