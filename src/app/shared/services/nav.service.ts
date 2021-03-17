import { Injectable } from '@angular/core';

//MenuItems Type
import {Menu} from './menu';

//Nav service => use to dynamically bind menu Items
//Menu Items data is written in nav service
//then dyanmically bind to Sidebar Component

@Injectable({
  providedIn: 'root'
})
export class NavService {

  //on Toggle => sidebar open/close
  //By deafult sidebarMenu is open
  //collpseNavbar = false
  collapseSidebar:boolean = false;
  
  constructor() { }

  //===================
  //SIDEBAR MENU ITEMS
  //====================
  MENUITEMS:Menu[] = [

    //Dashboard(home)
    {path:'/dashboard/default', type:'link', title:'Dashboard', icon:'home', active:true},

    //Products(box)   
    {title:'Products',type:'sub',icon:'box',active:false,
      children:[
        {title:'Physical',type:'sub',
          children:[
            {title:'Product List',path:'/products/physical/product-list',type:'link'},
            {title:'Add Product',path:'/products/physical/add-product',type:'link'},
          ]
        }
      ]
    },

    //Sales(dollar-sign)
    {title:'Sales',type:'sub',icon:'dollar-sign',active:false,
      children:[
        {title:'Orders',path:'/sales/orders',type:'link'},
        {title:'Transactions',path:'/sales/transactions',type:'link'},
      ]
    },

    //Masters(clipboard)
    {title:'Masters',type:'sub',icon:'clipboard',active:false,
      children:[
        {title:'Brand Logo Master',path:'/masters/brandlogo',type:'link'},
        {title:'Category Master',path:'/masters/category',type:'link'},
        {title:'Color Master',path:'/masters/color',type:'link'},
        {title:'Size Master',path:'/masters/size',type:'link'},
        {title:'Tag Master',path:'/masters/tag',type:'link'},
        {title:'User Type Master',path:'/masters/usertype',type:'link'}
      ]
    },

    //Users(user-plus)
    {title:'Users',type:'sub',icon:'user-plus',active:false,
      children:[
        {title:'User List',path:'/users/list-user',type:'link'},
        {title:'Create User',path:'/users/create-user',type:'link'},
      ]
    },

    //Reports(bar-charts)
    {path:'/reports',title:'Reports',type:'link',icon:'bar-chart',active:false},

    //Settings(settings)
    {title:'Settings',type:'sub',icon:'settings',active:false,
      children:[
        {title:'Profile',path:'/settings/profile',type:'link'}
      ]
    },

    //Invoice(archive)
    {path:'/invoice', type:'link', title:'Invoice', icon:'archive', active:false},

    //Login(goto login page => logout)
    {path:'/auth/login', type:'link', title:'Login', icon:'log-out', active:false}
  ];

}
