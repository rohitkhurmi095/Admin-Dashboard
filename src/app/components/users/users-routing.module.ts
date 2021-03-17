import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';

// /users/create-user & /users/list-user
const routes: Routes = [
  {
    path:'',
    children:[
      {path:'create-user', component:CreateUserComponent},
      {path:'list-user', component:ListUserComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
