import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//HttpClient Module
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

//loading modules - EAGERLY
import { AuthModule } from './components/auth/auth.module';
import { SharedModule } from './shared/shared.module';

//Toastr notifications
import {ToastrModule} from 'ngx-toastr';

//Interceptor
import { HeaderInterceptor } from './interceptors/header-interceptor.service';
import { ResponseInterceptor } from './interceptors/response-interceptor.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    //----- Eager Loading -----
    AuthModule,   //login,register etc
    SharedModule, //header,footer etc

    //Toastr Module
    ToastrModule.forRoot()
  ],
  //Provide interceptors used here
  providers: [
    //Interceptors (multi => multiple interceptors)
    {provide: HTTP_INTERCEPTORS, useClass:HeaderInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass:ResponseInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
