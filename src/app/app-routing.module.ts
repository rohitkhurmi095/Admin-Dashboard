import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Authentication: canActivate:[AuthGuard]
import { AuthGuard } from './components/auth/auth.guard';

//Layout component loads 1st 
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';

//feature modules load on demand loading 
//feature modules loaded file - contentRoutes (use as children here: to implement authGuard)
//contentRoute - routes for all feature modules:lazy loading (not their components)
import {contentRoute} from './shared/routes/content-routes';

const routes: Routes = [
  {path:'', component:ContentLayoutComponent, 
    children:contentRoute, canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
