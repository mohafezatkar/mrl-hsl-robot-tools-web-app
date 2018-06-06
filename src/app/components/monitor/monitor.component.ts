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
  @ViewChild('field') field;
  @ViewChildren('cmp') can;
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
  fieldContext: CanvasRenderingContext2D;
  label_color_unpack_lut = [0, 1, 2, 4, 8, 16];
  imageArray = [];


  constructor() {
    setInterval(() => {
      this.gettime(); }, 3000);
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
          this.monitorX.splice(monitorArrayIndex, 1, this.monitorData[0].pose.x);
          this.monitorY.splice(monitorArrayIndex, 1, this.monitorData[0].pose.y);
          this.monitorA.splice(monitorArrayIndex, 1, this.monitorData[0].pose.a);
          this.monitorxBall.splice(monitorArrayIndex, 1, this.monitorData[0].ball.x);
          this.monitoryBall.splice(monitorArrayIndex, 1, this.monitorData[0].ball.y);
          this.monitorRole.splice(monitorArrayIndex, 1, this.monitorData[0].role);
          this.monitorpBall.splice(monitorArrayIndex, 1, this.monitorData[0].ball.p);
          this.monitorBatteryLevels.splice(monitorArrayIndex, 1, this.monitorData[0].battery_level);
          this.monitorTime.splice(monitorArrayIndex, 1, Time.getTime());
          this.position();
          this.string2label_rle(this.monitorData[0].sendlabelB.arr.data, monitorArrayIndex);
        }
        else {
          this.monitorIDs.push(this.monitorData[0].id);
          this.monitorNames.push(this.monitorData[0].robotName);
        }
      });

  }

  ngAfterViewInit() {
    this.fieldContext = this.field.nativeElement.getContext('2d');
    this.drawField();
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
    for (let k = 0; k < 60; k++) {
      for (let j = 0; j < 80; j++) {
        index = (k * 80) + j;
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
    const width = 624;
    const height = 444;
    this.fieldContext.clearRect(0, 0, width, height);
    this.drawField();
    for (let i = 0; i < this.monitorIDs.length; i++) {
      const xAngle = (this.monitorX[i] * width / 2) / 5.2 + width / 2 + 20 * Math.cos(this.monitorA[i]);
      const yAngle = height / 2 - (this.monitorY[i] * height / 2) / 3.7 - 20 * Math.sin(this.monitorA[i]);
      const ca = Math.cos(this.monitorA[i]);
      const sa = Math.sin(this.monitorA[i]);
      const xGlobal = width / 2 + (this.monitorX[i] + ca * this.monitorxBall[i] - sa * this.monitoryBall[i]) * 60;
      const yGlobal = height / 2 - (this.monitorY[i] + sa * this.monitorxBall[i] + ca * this.monitoryBall[i]) * 60;
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
      if (this.monitorpBall[i].toString().includes('e')) {
        this.fieldContext.globalAlpha = 0.1;
        this.fieldContext.beginPath();
        this.fieldContext.arc(xGlobal, yGlobal, 8.40, 0, 2 * Math.PI, true);
        this.fieldContext.fill();
        this.fieldContext.globalAlpha = 1.0;
        this.fieldContext.stroke();
      } else {
        this.fieldContext.globalAlpha = this.monitorpBall[i];
        this.fieldContext.beginPath();
        this.fieldContext.arc(xGlobal, yGlobal, 8.40, 0, 2 * Math.PI, true);

        this.fieldContext.fill();
        this.fieldContext.globalAlpha = 1.0;
        this.fieldContext.stroke();
      }

      this.fieldContext.beginPath();
      this.fieldContext.globalAlpha = 1.0;
      this.fieldContext.arc((this.monitorX[i] * width / 2) / 5.2 + width / 2,  height / 2 - (this.monitorY[i] * height / 2) / 3.7 , 10, 0, 2 * Math.PI);
      this.fieldContext.fill();
      this.fieldContext.beginPath();
      this.fieldContext.moveTo((this.monitorX[i] * width / 2) / 5.2 + width / 2, height / 2 - (this.monitorY[i] * height / 2) / 3.7);
      this.fieldContext.lineTo(xAngle, yAngle);
      this.fieldContext.stroke();
      this.fieldContext.font = '20px Arial';
      this.fieldContext.fillStyle = 'black';
      this.fieldContext.fillText(this.monitorIDs[i], (this.monitorX[i] * width / 2) / 5.2 + width / 2 - 3.7, height / 2 - (this.monitorY[i] * height / 2) / 3.7 + 7);
    }
  }

  drawField(){
    // Outer lines
    const width = 624;
    const height = 444;
    this.fieldContext.beginPath();
    this.fieldContext.rect(0, 0, width, height);
    this.fieldContext.stroke();
    this.fieldContext.rect(42, 42, width - 84, height - 84);
    this.fieldContext.fillStyle = '#060';
    this.fieldContext.fill();
    this.fieldContext.lineWidth = 3;
    this.fieldContext.strokeStyle = '#FFF';
    this.fieldContext.stroke();
    this.fieldContext.closePath();

    this.fieldContext.fillStyle = '#FFF';

    // Mid line
    this.fieldContext.beginPath();
    this.fieldContext.moveTo(width / 2, 42);
    this.fieldContext.lineTo(width / 2, height - 42);
    this.fieldContext.stroke();
    this.fieldContext.closePath();

    //Mid circle
    this.fieldContext.beginPath();
    this.fieldContext.arc(width / 2, height / 2, 45, 0, 2 * Math.PI, false);
    this.fieldContext.stroke();
    this.fieldContext.closePath();

    //Mid point
    this.fieldContext.beginPath();
    this.fieldContext.arc(width / 2, height / 2, 3, 0, 2 * Math.PI, false);
    this.fieldContext.fill();
    this.fieldContext.closePath();


    //Home goal box
    this.fieldContext.beginPath();
    this.fieldContext.rect(42, 72, 60, 300);
    this.fieldContext.stroke();
    this.fieldContext.closePath();
    // Home goal
    this.fieldContext.beginPath();
    this.fieldContext.rect(6, 144, 36, 156);
    this.fieldContext.stroke();
    this.fieldContext.closePath();

    // Home penalty point
    this.fieldContext.beginPath();
    this.fieldContext.arc(168, height / 2, 3, 0, 2 * Math.PI, true);
    this.fieldContext.fill();
    this.fieldContext.closePath();

    // Away goal box
    this.fieldContext.beginPath();
    this.fieldContext.rect(522 , 72, 60, 300);
    this.fieldContext.stroke();
    this.fieldContext.closePath();
    // Away goal
    this.fieldContext.beginPath();
    this.fieldContext.rect(582, 144, 36, 156);
    this.fieldContext.stroke();
    this.fieldContext.closePath();

    // Away penalty point
    this.fieldContext.beginPath();
    this.fieldContext.arc(width - 168, height / 2, 3, 0, 2 * Math.PI, true);
    this.fieldContext.fill();
    this.fieldContext.closePath();



  }

  gettime() {
    const Time = new Date();
    for (let i = 0; i < this.monitorIDs.length; i++) {
      const checkTime = Time.getTime() - this.monitorTime[i];
      if (checkTime > 3000) {
        this.monitorIDs.splice(i, 1);
        this.monitorNames.splice(i, 1);
        this.monitorX.splice(i, 1);
        this.monitorY.splice(i, 1);
        this.monitorA.splice(i, 1);
        this.monitorxBall.splice(i, 1);
        this.monitoryBall.splice(i, 1);
        this.monitorRole.splice(i, 1);
        this.monitorpBall.splice(i, 1);
        this.monitorBatteryLevels.splice(i, 1);
        this.monitorTime.splice(i, 1);
      }
      this.position();
    }
  }
}
