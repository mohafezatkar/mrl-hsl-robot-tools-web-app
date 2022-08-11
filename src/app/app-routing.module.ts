import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { HomeComponent } from './home/home.component';
import { MonitorComponent } from './monitor/monitor.component';
import { RobotTerminalComponent } from "./robot-terminal/robot-terminal.component";

const routes: Routes = [
  {path : '', component : HomeComponent},
  {path : 'monitor', component : MonitorComponent},
  {path : 'config', component : ConfigurationComponent},
  {path : 'terminal', component : RobotTerminalComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
