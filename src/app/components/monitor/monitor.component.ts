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
  @ViewChild ('field') field;
  @ViewChildren ('cmp') can;
  fieldContext: CanvasRenderingContext2D;
  fieldImage = new Image(624, 444);
  ballImage = new Image(10, 10);
  xsize;
  ysize;
  label_color_unpack_lut = [0, 1, 2, 4, 8, 16];
  imageArray = [];
  constructor() {
    this.ws.onMessage(
        (msg: MessageEvent) => {
        this.monitorData = [];
        this.monitorData.push(JSON.parse(msg.data));
        if (this.monitorIDs.includes(this.monitorData[0].id)){
          const monitorArrayIndex = this.monitorIDs.indexOf(this.monitorData[0].id);
          this.string2label_rle(this.monitorData[0].sendlabelB.arr.data, monitorArrayIndex);
          this.position(this.monitorData[0].pose.x, this.monitorData[0].pose.y, this.monitorData[0].pose.a, this.monitorData[0].ball.x * 100 , this.monitorData[0].ball.y * 100, this.monitorData[0].ball.p, this.monitorData[0].id, this.monitorData[0].role);
        }
        else {
          this.monitorIDs.push(this.monitorData[0].id);
          this.monitorNames.push(this.monitorData[0].robotName);
          this.monitorBatteryLevels.push(this.monitorData[0].battery_level);
        }
      });
  }

  ngAfterViewInit() {
    this.ballImage.src = '../../../assets/img/ball.png';
    this.fieldImage.src = '../../../assets/img/Soccer%20Field.png';
    this.xsize = this.fieldImage.height / 2;
    this.ysize = this.fieldImage.width / 2;
    this.fieldContext = this.field.nativeElement.getContext('2d');
    this.fieldImage.onload =  () =>
    {
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
        for (let i = 0; i < len; i++){
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
          contect.fillRect( j, k, 1, 1 );
        }
        if (this.imageArray[index] === 8) {
          contect.fillStyle = 'green';
          contect.fillRect( j, k, 1, 1 );
        }
        if (this.imageArray[index] === 16) {
          contect.fillStyle = 'white';
          contect.fillRect( j, k, 1, 1 );
        }
      }
    }
  }

  position(x, y, a, xBall, yBall, pBall, id, role) {
    const xAngle = 20 * Math.cos(a) + this.fieldImage.width / 2;
    const yAngle = 20 * Math.sin(a) + this.fieldImage.height / 2;
    this.fieldContext.clearRect(0, 0, this.fieldImage.width, this.fieldImage.height);
    this.fieldContext.drawImage(this.fieldImage, 0, 0, this.fieldImage.width, this.fieldImage.height);
    if (role === 0) {
      this.fieldContext.fillStyle = 'white';
    }
    if (role === 1) {
      this.fieldContext.fillStyle = 'red';
    }
    if (role === 2) {
      this.fieldContext.fillStyle = 'yellow';
    }
    if (role === 3) {
      this.fieldContext.fillStyle = 'blue';
    }
    this.fieldContext.fillRect(80, 80, 75, 50);
    this.fieldContext.globalAlpha = pBall;
    this.fieldContext.beginPath(); +
    this.fieldContext.fillRect(20, 20, 75, 50);
    this.fieldContext.arc(xBall + this.fieldImage.width / 2, yBall + this.fieldImage.height / 2, 10, 0, 2 * Math.PI, true);
    this.fieldContext.fillStyle = 'red';
    this.fieldContext.fill();
    this.fieldContext.globalAlpha = 1.0;
    this.fieldContext.arc(x + this.fieldImage.width / 2, y + this.fieldImage.height / 2, 10, 0, 2 * Math.PI);
    this.fieldContext.fill();
    this.fieldContext.beginPath();
    this.fieldContext.moveTo(x + this.fieldImage.width / 2 + 10, y + this.fieldImage.height / 2);
    this.fieldContext.lineTo(xAngle, yAngle);
    this.fieldContext.stroke();
    this.fieldContext.font = '20px Arial';
    this.fieldContext.fillStyle = 'black';
    this.fieldContext.fillText(id, x + this.fieldImage.width / 2 - 5, y + this.fieldImage.height / 2 + 7);
  }
}
