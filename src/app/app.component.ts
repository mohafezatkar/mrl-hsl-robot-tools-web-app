import {Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';
import {NgForm} from '@angular/forms';
import {from} from 'rxjs/observable/from';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
  }
}

    // for (let i = 0; i < this.configData.length; i++) {
    //   if (this.configData[i].tag === 2 && this.configData[i].value === true){
    //     this.configData[i].value = ' 1';
    //   }
    //   if (this.configData[i].tag === 2 && this.configData[i].value === false){
    //     this.configData[i].value = ' 0';
    //   }
    //   if (this.configData[i].tag === 4){
    //     this.newValue = this.currentValue[i];
    //     this.configData[i].value = '--' + this.optionValue[i] + ':' + this.newValue;
    //     console.log(this.configData[i].value);
    //   }
    //   this.ws.send({'SetConfigToken': this.configData[i]}, WebSocketSendMode.Promise).then(
    //     (data) => {
    //       console.log(this.configData);
    //     },
    //     (T) => {
    //       console.log('not send');
    //     }
    //   );
    // }





