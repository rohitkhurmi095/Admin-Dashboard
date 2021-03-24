import { Component, OnInit } from '@angular/core';
import { Global } from '../../global';

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
  email:string;
  
  //----- USER DETAILS -----
  //USER PROFILE (received from userData in localStorage)
  //default PROFILE IMAGE if there is no image to upload
  imagePath:string = "/assets/images/dashboard/user.png";
  //userDetails Object for current User from localStorage
  userDetails:any; 
  //-------------------------

  //Dynamically binding MenuItem => Dependency Inejction
  //public => {{_navService}} can be used on html
  constructor(public _navService:NavService) { }

  ngOnInit(): void {
    this.menuItems = this._navService.MENUITEMS;
  
    //------------------
    // USER DETAILS
    //------------------
    //we have userDetais stored in localStorage - set in login Component (authService)
    //to get user details in header component
    //get userDetails from localStorage

    //userDetails (object)
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    //console.log('OBJ userDetails:',this.userDetails);

    //userName
    this.userName = `${this.userDetails.firstName} ${this.userDetails.lastName}`;
    this.email = this.userDetails.email;

    //profile image = Global.BASE_IMAGES_PATH + this.userDetails.imagePath
    this.imagePath = (this.userDetails.imagePath == "" || this.userDetails.imagePath == null)? 'assets/images/dashboard/user.png' : Global.BASE_USER_IMAGES_PATH + this.userDetails.imagePath;
    //--------------------
  }

  //Submenu of menu open/close based on active class
  onToggleNavActive(item:any){
    item.active = !item.active;
  }

}
