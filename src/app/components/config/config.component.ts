import { Component } from '@angular/core';
import {$WebSocket, WebSocketSendMode} from 'angular2-websocket/angular2-websocket';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent{
  ws = new $WebSocket('ws://localhost:1234/');
  configData = [];
  configDataCounter = 0;
  currentSplitter = [];
  currentSplitterCounter = 0;
  option = [];
  optionValue = [];
  currentValue = [];
  newValue = '';
  fileIndex = 0;
  constructor() {
    this.ws.onMessage(
      (msg: MessageEvent) => {
        console.log(msg.data);
        this.configData.push(JSON.parse(msg.data));
        while (this.configDataCounter < this.configData.length) {
          this.fileIndex = 0;
          for (let i = 0; i < this.configData[this.configDataCounter].length; i++)
          {
            if (this.configData[this.configDataCounter][this.fileIndex].tag === 2
              && this.configData[this.configDataCounter][this.fileIndex].value === ' 0') {
              this.configData[this.configDataCounter][this.fileIndex].value = false;
            }
            if (this.configData[this.configDataCounter][this.fileIndex].tag === 2 &&
              this.configData[this.configDataCounter][this.fileIndex].value === ' 1') {
              this.configData[this.configDataCounter][this.fileIndex].value = true;
            }
            if (this.configData[this.configDataCounter][this.fileIndex].tag === 4) {
              this.currentSplitter[this.currentSplitterCounter] = this.configData[this.configDataCounter][this.fileIndex].value.split(':');
              this.currentValue[this.fileIndex] = this.currentSplitter[this.currentSplitterCounter][1];
              this.option[this.fileIndex] = this.currentSplitter[this.currentSplitterCounter][0].split('--');
              this.optionValue[this.fileIndex] = this.option[this.fileIndex][1].split(',');
              this.currentSplitterCounter++;
            }
            this.fileIndex++;
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
    this.currentSplitter = [];
    this.currentSplitterCounter = 0;
    this.option = [];
    this.optionValue = [];
    this.currentValue = [];
    this.newValue = '';
    this.fileIndex = 0;
    this.ws.send({'GetRobotConfig': ''}, WebSocketSendMode.Promise).then();
  }

  onInputChange() {
    this.configDataCounter = 0;
    this.ws.send({'ResetTokenList': ''}, WebSocketSendMode.Promise).then();
    while (this.configDataCounter < this.configData.length) {
      this.fileIndex = 0;
      for (let i = 0; i < this.configData[this.configDataCounter].length; i++) {
        if (this.configData[this.configDataCounter][this.fileIndex].tag === 2
          && this.configData[this.configDataCounter][this.fileIndex].value === true) {
          this.configData[this.configDataCounter][this.fileIndex].value = ' 1';
        }
        if (this.configData[this.configDataCounter][this.fileIndex].tag === 2 &&
          this.configData[this.configDataCounter][this.fileIndex].value === false) {
          this.configData[this.configDataCounter][this.fileIndex].value = ' 0';
        }
        if (this.configData[this.configDataCounter][this.fileIndex].tag === 4) {
          this.newValue = this.currentValue[this.fileIndex];
          this.configData[this.configDataCounter][this.fileIndex].value = '--' + this.optionValue[this.fileIndex] + ':' + this.newValue;
        }
        this.fileIndex++;
      }
      this.ws.send({'SetConfigToken': this.configData[this.configDataCounter]}, WebSocketSendMode.Promise).then();
      this.configDataCounter++;
    }

    this.ws.send({'DoneConfigToken': ''}, WebSocketSendMode.Promise).then();
    this.getConfigData();
  }

}
