import { Component } from '@angular/core';
import {faTvAlt, faHouse, faGears, faTerminal, faDiagramProject, faChartLine} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mrl-hsl-robot-tools-web';
  faHouse = faHouse;
  faTvAlt = faTvAlt;
  faGears = faGears;
  faTerminal = faTerminal;
  faDiagram = faDiagramProject;
  faChartLine = faChartLine;
}
