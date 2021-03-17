import { Component, OnInit } from '@angular/core';

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

  constructor(public _navService:NavService) { }

  ngOnInit(): void {
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
