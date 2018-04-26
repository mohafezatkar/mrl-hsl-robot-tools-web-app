import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatListModule, MatGridListModule, MatInputModule, MatCheckboxModule,
  MatTabsModule, MatSelectModule, MatToolbarModule, MatSidenavModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MonitorComponent } from './components/monitor/monitor.component';
import { ConfigComponent } from './components/config/config.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    MonitorComponent,
    ConfigComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

