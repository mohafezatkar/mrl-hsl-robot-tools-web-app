import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MatListModule, MatGridListModule, MatInputModule, MatCheckboxModule, MatTabsModule, MatSelectModule,
  MatToolbarModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    MatToolbarModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

