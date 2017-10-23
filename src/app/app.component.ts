import { Component } from '@angular/core';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';
import {forEach} from '@angular/router/src/utils/collection';
import {forEachToken} from 'tslint';
import {split} from 'ts-node/dist';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ws = new $WebSocket('ws://localhost:1234/');
  configData = [];
  configDataCounter = 0;
  currentSplitter = [];
  currentSplitterCounter = 0;
  option = [];
  optionValue = [];
  currentValue = [];
  j = 0;
  newValue = '';
  constructor() {
    this.ws.onMessage(
      (msg: MessageEvent) => {
        this.configData.push(JSON.parse(msg.data));
        while (this.configDataCounter < this.configData.length) {
          if (this.configData[this.configDataCounter].tag === 2 && this.configData[this.configDataCounter].value === ' 0') {
            this.configData[this.configDataCounter].value = false;
            console.log(this.configData[this.configDataCounter].value);
          }
          if (this.configData[this.configDataCounter].tag === 2 && this.configData[this.configDataCounter].value === ' 1') {
            this.configData[this.configDataCounter].value = true;
            console.log(this.configData[this.configDataCounter].value);
          }
          if (this.configData[this.configDataCounter].tag === 4) {
            this.currentSplitter[this.currentSplitterCounter] = this.configData[this.configDataCounter].value.split(':');
            this.currentValue[this.configDataCounter] = this.currentSplitter[this.currentSplitterCounter][1];
            this.option[this.j] = this.currentSplitter[this.currentSplitterCounter][0].split('--');
            this.optionValue[this.configDataCounter] = this.option[this.j][1].split(',');
            this.j++;
            this.currentSplitterCounter++;
          }
          this.configDataCounter++;
        }
      },
      {autoApply: false}
    );
  }

  getConfigData() {
    this.configData = [];
    this.configDataCounter = 0;
    this.currentSplitterCounter = 0;
    this.j = 0;
    this.ws.send({'GetRobotConfig': ''}, WebSocketSendMode.Promise).then(
      (data) => {
        console.log('is send');
      },
      (T) => {
        console.log('not send');
      }
    );
  }
  onInputChange() {
    console.log(this.configData);
    this.ws.send({'ResetTokenList': ''}, WebSocketSendMode.Promise).then(
      (data) => {
        // console.log(this.configData);
      },
      (T) => {
        console.log('not send');
      }
    );

    for (let i = 0; i < this.configData.length; i++) {
      if (this.configData[i].tag === 2 && this.configData[i].value === true){
        this.configData[i].value = ' 1';
      }
      if (this.configData[i].tag === 2 && this.configData[i].value === false){
        this.configData[i].value = ' 0';
      }
      if (this.configData[i].tag === 4){
        this.newValue = this.currentValue[i];
        this.configData[i].value = '--' + this.optionValue[i] + ':' + this.newValue;
        console.log(this.configData[i].value);
      }
      this.ws.send({'SetConfigToken': this.configData[i]}, WebSocketSendMode.Promise).then(
        (data) => {
          console.log(this.configData);
          },
        (T) => {
          console.log('not send');
        }
        );
    }

    this.ws.send({'DoneConfigToken': ''}, WebSocketSendMode.Promise).then(
      (data) => {
        console.log(this.configData);
      },
      (T) => {
        console.log('not send');
      }
    );
    this.getConfigData();
  }

  // onPost(form: NgForm) {
  //   console.log(form.value);
  // }
}

