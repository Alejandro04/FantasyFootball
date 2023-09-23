import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TeamComponent } from './team/components/team.component';
import { FormsModule } from '@angular/forms';
import { ApiInterceptor } from './team/interceptors/interceptor';
import { SpinnerService } from './team/services/spinnerService';

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
