import { Component, OnInit,AfterViewInit, Input } from '@angular/core';

import *  as feather from 'feather-icons';

@Component({
  selector: 'app-feather-icon',
  templateUrl: './feather-icon.component.html',
  styleUrls: ['./feather-icon.component.scss']
})
export class FeatherIconComponent implements OnInit,AfterViewInit {

   //data from parent component
  //feather icon name: 'icon'
  //use name feathericon in html file
  @Input('icon') public feathericon:any;

  constructor() { }

  //to use feather icons - static way (put here)
  //when bindings takes place
  ngOnInit(): void {
    //feather.replace();
  }

  //using feather-icons as generic(dynamic way)
  ngAfterViewInit(){
    feather.replace();
  }
}
