import { Component, OnInit } from '@angular/core';

//MenuItems Type
import {Menu} from '../../services/menu';
//Nav Service(Menu Items data)
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems:Menu[];
  userName:string;
  userType:string;

  //Dynamically binding MenuItem => Dependency Inejction
  //public => {{_navService}} can be used on html
  constructor(public _navService:NavService) { }

  ngOnInit(): void {
    this.menuItems = this._navService.MENUITEMS;
    this.userName = "Welcome";
    this.userType = "Admin";
  }

  //Submenu of menu open/close based on active class
  onToggleNavActive(item:any){
    item.active = !item.active;
  }

}
