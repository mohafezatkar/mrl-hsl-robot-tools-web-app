import {Component, OnInit, ViewChild, ViewChildren, AfterViewInit} from '@angular/core';
import {$WebSocket} from 'angular2-websocket/angular2-websocket';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})

export class MonitorComponent implements OnInit, AfterViewInit {
  ws = new $WebSocket('ws://localhost:5056/',
    ['dumb-increment-protocol']);
  monitorIDs = [];
  monitorData = [];
  monitorNames = [];
  monitorBatteryLevels = [];
  monitorX = [];
  monitorY = [];
  monitorA = [];
  monitorxBall = [];
  monitoryBall = [];
  monitorpBall = [];
  monitorRole = [];
  monitorTime = [];
  @ViewChild('field') field;
  @ViewChildren('cmp') can;
  fieldContext: CanvasRenderingContext2D;
  fieldImage = new Image(624, 444);
  xsize;
  ysize;
  label_color_unpack_lut = [0, 1, 2, 4, 8, 16];
  imageArray = [];


  constructor() {
    this.ws.onClose(
      () => {
        console.log('WebSocket Closed');
        this.monitorIDs = [];
        this.position();
      }
    );
    this.ws.onMessage(
      (msg: MessageEvent) => {
        const Time = new Date();
        this.monitorData = [];
        this.monitorData.push(JSON.parse(msg.data));
        if (this.monitorIDs.includes(this.monitorData[0].id)) {
          const monitorArrayIndex = this.monitorIDs.indexOf(this.monitorData[0].id);
          this.string2label_rle(this.monitorData[0].sendlabelB.arr.data, monitorArrayIndex);
          this.monitorX.splice(monitorArrayIndex, 1, this.monitorData[0].pose.x);
          this.monitorY.splice(monitorArrayIndex, 1, this.monitorData[0].pose.y);
          this.monitorA.splice(monitorArrayIndex, 1, this.monitorData[0].pose.a);
          this.monitorxBall.splice(monitorArrayIndex, 1, this.monitorData[0].ball.x * 100);
          this.monitoryBall.splice(monitorArrayIndex, 1, this.monitorData[0].ball.y * 100);
          this.monitorRole.splice(monitorArrayIndex, 1, this.monitorData[0].role);
          this.monitorpBall.splice(monitorArrayIndex, 1, this.monitorData[0].ball.p);
          this.monitorBatteryLevels.splice(monitorArrayIndex, 1, this.monitorData[0].battery_level);
          this.monitorTime.splice(monitorArrayIndex, 1, Time.getTime());
          this.position();
        }
        else {
          this.monitorIDs.push(this.monitorData[0].id);
          this.monitorNames.push(this.monitorData[0].robotName);
        }
      });
  }

  ngAfterViewInit() {
    this.fieldImage.src = '../../../assets/img/Soccer%20Field.png';
    this.xsize = this.fieldImage.height / 2;
    this.ysize = this.fieldImage.width / 2;
    this.fieldContext = this.field.nativeElement.getContext('2d');
    this.fieldImage.onload = () => {
      this.fieldContext.drawImage(this.fieldImage, 0, 0, this.fieldImage.width, this.fieldImage.height);
    };
  }

  ngOnInit() {

  }

  string2label_rle(cdata, monitorArrayIndex) {
    const cani = this.can._results[monitorArrayIndex]._element.nativeElement.childNodes[0].children[0];
    const contect = cani.getContext('2d');
    this.imageArray = [];
    let ind = 0;
    let cind = 0;
    const dout = [];
    while (cdata[cind] !== undefined && cdata[cind + 1] !== undefined) {
      const data1 = cdata.charCodeAt(cind) - 48;
      cind++;
      if (data1 > 5) {
        // Single data
        dout[ind] = this.label_color_unpack_lut[data1 - 5];
        this.imageArray.push(dout[ind]);
        ind++;
      }
      else {
        // Multiple data
        const len = cdata.charCodeAt(cind) - 48;
        cind++;
        for (let i = 0; i < len; i++) {
          dout[ind] = this.label_color_unpack_lut[data1];
          this.imageArray.push(dout[ind]);
          ind++;
        }
      }
    }
    contect.beginPath();
    let index = 0;
    for (let k = 0; k < 72; k++) {
      for (let j = 0; j < 128; j++) {
        index = (k * 128) + j;
        if (this.imageArray[index] === 0) {
          contect.fillStyle = 'black';
          contect.fillRect(j, k, 1, 1);
        }
        if (this.imageArray[index] === 8) {
          contect.fillStyle = 'green';
          contect.fillRect(j, k, 1, 1);
        }
        if (this.imageArray[index] === 16) {
          contect.fillStyle = 'white';
          contect.fillRect(j, k, 1, 1);
        }
      }
    }
  }

  position() {
    this.fieldContext.clearRect(0, 0, this.fieldImage.width, this.fieldImage.height);
    this.fieldContext.drawImage(this.fieldImage, 0, 0, this.fieldImage.width, this.fieldImage.height);
    for (let i = 0; i < this.monitorIDs.length; i++) {
      const xAngle = (this.monitorX[i] * this.fieldImage.width / 2) / 4.5 + this.fieldImage.width / 2 + 20 * Math.cos(this.monitorA[i]);
      const yAngle = this.fieldImage.height / 2 - (this.monitorY[i] * this.fieldImage.height / 2) / 3 - 20 * Math.sin(this.monitorA[i]);
      const ca = Math.cos(this.monitorA[i]);
      const sa = Math.sin(this.monitorA[i]);
      const xGlobal = (this.monitorX[i] * this.fieldImage.width / 2) / 4.5 + this.fieldImage.width / 2  + ca * this.monitorxBall[i] - sa * this.monitoryBall[i];
      const yGlobal = this.fieldImage.height / 2 - (this.monitorY[i] * this.fieldImage.height / 2) / 3 - sa * this.monitorxBall[i] - ca * this.monitoryBall[i];
      if (this.monitorRole[i] === 0) {
        this.fieldContext.fillStyle = 'white';
      }
      if (this.monitorRole[i] === 1) {
        this.fieldContext.fillStyle = 'red';
      }
      if (this.monitorRole[i] === 2) {
        this.fieldContext.fillStyle = 'yellow';
      }
      if (this.monitorRole[i] === 3) {
        this.fieldContext.fillStyle = 'blue';
      }
      if (this.monitorpBall[i].toString().includes('e')){
        console.log('NO BALL');
      }

      else {
        this.fieldContext.globalAlpha = this.monitorpBall[i];
        this.fieldContext.beginPath();
        this.fieldContext.arc(xGlobal, yGlobal, 10, 0, 2 * Math.PI, true);
        this.fieldContext.fill();
        this.fieldContext.globalAlpha = 1.0;
        this.fieldContext.stroke();
      }

      this.fieldContext.beginPath();
      this.fieldContext.globalAlpha = 1.0;
      this.fieldContext.arc((this.monitorX[i] * this.fieldImage.width / 2) / 4.5 + this.fieldImage.width / 2,  this.fieldImage.height / 2 - (this.monitorY[i] * this.fieldImage.height / 2) / 3 , 10, 0, 2 * Math.PI);
      this.fieldContext.fill();
      this.fieldContext.beginPath();
      this.fieldContext.moveTo((this.monitorX[i] * this.fieldImage.width / 2) / 4.5 + this.fieldImage.width / 2, this.fieldImage.height / 2 - (this.monitorY[i] * this.fieldImage.height / 2) / 3);
      this.fieldContext.lineTo(xAngle, yAngle);
      this.fieldContext.stroke();
      this.fieldContext.font = '20px Arial';
      this.fieldContext.fillStyle = 'black';
      this.fieldContext.fillText(this.monitorIDs[i], (this.monitorX[i] * this.fieldImage.width / 2) / 4.5 + this.fieldImage.width / 2 - 3, this.fieldImage.height / 2 - (this.monitorY[i] * this.fieldImage.height / 2) / 3 + 7);
    }
  }
}
