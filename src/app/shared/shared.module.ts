import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FeatherIconComponent } from './components/feather-icon/feather-icon.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';


//To use routing:directives in shared module (With no routing)
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, FeatherIconComponent, SidebarComponent, BreadcrumbComponent, ContentLayoutComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  //To use component in other modules
  exports:[FeatherIconComponent]
})
export class SharedModule { }
