import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { CategoryComponent } from './category/category.component';
import { ColorComponent } from './color/color.component';
import { SizeComponent } from './size/size.component';
import { TagComponent } from './tag/tag.component';
import { UsertypeComponent } from './usertype/usertype.component';

// /masters/componentName
const routes: Routes = [
  {path:'',
    children:[
      {path:'brandlogo', component:BrandlogoComponent},
      {path:'color', component:ColorComponent},
      {path:'category', component:CategoryComponent},
      {path:'size', component:SizeComponent},
      {path:'tag', component:TagComponent},
      {path:'usertype', component:UsertypeComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
