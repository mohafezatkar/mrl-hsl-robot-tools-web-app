import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConfigComponent} from './components/config/config.component';
import {MonitorComponent} from './components/monitor/monitor.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path : '', component : HomeComponent},
  {path : 'monitor', component : MonitorComponent},
  {path : 'config', component : ConfigComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
