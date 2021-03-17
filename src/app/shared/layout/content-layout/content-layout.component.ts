import { Component, OnInit } from '@angular/core';

//NavService 
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  //public => use on html
  constructor(public _navService:NavService) { }

  ngOnInit(): void {
  }

}
