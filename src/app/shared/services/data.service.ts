import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //HTTP CLIENT - for handling requests
  constructor(private http:HttpClient) { }
  
  //NOTE:here we didint set headers for each request
  //headers for all requests are set via http header_interceptor - pass JWT single time for all headers
  //else set headers for all requests 
  //let httpHeaders = new HttpHeaders().set('Content-Type','application/json');


  //===============
  // GET
  //===============
  get(url:string):Observable<any>{
    return this.http.get(url);
  }

  //===============
  // POST
  //===============
  post(url:string,model:any):Observable<any>{
    const body = JSON.stringify(model);

    //set headers
    let httpHeaders = new HttpHeaders().set('Content-Type','application/json');

    return this.http.post(url,body,{
      headers:httpHeaders
    });
  }

  //NOTE For images we dont have to set headers
  //dont JSON.stringify(model) image data as bytes will be lost
  //create seprate handler for postImages 
  //set isImate flag in handler - to identify it is image 
  //=> avoid set headers for images in interceptors
  postImages(url:string,model:any){
    let httpHeaders = new HttpHeaders().set('isImage','');
    return this.http.post(url,model);
  }


  //===============
  // PUT
  //===============
  put(url:string,id:number,model:any):Observable<any>{
    const body = JSON.stringify(model);

    //set headers
    let httpHeaders = new HttpHeaders().set('Content-Type','application/json');

    return this.http.put(url + id,body,{
      headers:httpHeaders
    });
  }

  
  //===============
  // DELETE 
  //===============
  delete(url:string,id:number):Observable<any>{

    //set headers
    let httpHeaders = new HttpHeaders().set('Content-Type','application/json');

    return this.http.delete(url + id, {
      headers:httpHeaders
    });
  }


}
