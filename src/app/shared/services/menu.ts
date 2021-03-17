export interface Menu {
    //MENU Items Type
   //? => optional parameters

   path?:string,    //if path given => type = link else type = sub
   title?:string,  //title of menuItem
   type?:string,  //type = sub or link
   icon?:string,  //feather-icon name
   active?:boolean,  //highlighted or not - current menuItem
   children?:Menu[]; //submenu of Menu[]
}
