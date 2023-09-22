import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TeamComponent } from './team/team.component';
import { FormsModule } from '@angular/forms';
import { ApiInterceptor } from './interceptor';
import { SpinnerService } from './spinnerService';

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    SpinnerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
