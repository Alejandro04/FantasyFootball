import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TeamComponent } from './team/components/team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiInterceptor } from './team/interceptors/interceptor';
import { SpinnerService } from './team/services/spinnerService';
import { CoachComponent } from './team/components/coach/coach.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    TeamComponent,
    CoachComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    SpinnerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
