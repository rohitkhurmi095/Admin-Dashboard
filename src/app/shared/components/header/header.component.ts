import { Component, OnInit } from '@angular/core';
import { Global } from '../../global';

//Nav Service
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  //for toggling header
  open:boolean = false;
  openNav:boolean = false;

  //----- USER DETAILS -----
  //USER PROFILE (received from userData in localStorage)
  //default PROFILE IMAGE if there is no image to upload
  imagePath:string = "/assets/images/dashboard/user.png";
  //userDetails Object for current User from localStorage
  userDetails:any; 
  //-------------------------

  constructor(public _navService:NavService) { }

  ngOnInit(): void {
    
    //------------------
    // USER DETAILS
    //------------------
    //we have userDetais stored in localStorage - set in login Component (authService)
    //to get user details in header component
    //get userDetails from localStorage

    //userDetails (object)
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    //console.log('OBJ userDetails:',this.userDetails);

    //profile image = Global.BASE_IMAGES_PATH + this.userDetails.imagePath
    this.imagePath = (this.userDetails.imagePath == "" || this.userDetails.imagePath == null)? 'assets/images/dashboard/user.png' : Global.BASE_USER_IMAGES_PATH + this.userDetails.imagePath;
    //--------------------
  }

  //left side of header: collapse
  collapseSidebar(){
    //if open, close on toggle
    this.open = !this.open;
    //if collapsed = ! collapsed & vice versa
    this._navService.collapseSidebar = !this._navService.collapseSidebar;
  }

  //right side of header
  //toggle ... top-down on mobile screen
  //open/close - toggle header ... for mobile nav
  openMobileNav(){
    this.openNav = !this.openNav;
  }

}
