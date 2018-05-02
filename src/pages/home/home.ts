import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import 'rxjs/add/operator/map';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  student_id:any;
  courseid: any;
  groupnum: number;
  score: number;
  fixscore:any = true;

  //API Url and Google sheet id
  public link = 'https://google-sheet-api.herokuapp.com/';
  public spreadsheetId = '1KaiWI5buoTT5AtT3LJis2nffPCVNiqC6v_4xIE-xzQI';
  public namesheet = 'SheetApi';

  public scanOption = {
    showTorchButton : true,
    prompt : "ให้ตำแหน่งของ barcode อยู่ภายในพื้นที่ scan",
    disableSuccessBeep: false
  };

  constructor(public navCtrl: NavController, public alerCtrl: AlertController, public barcodeScanner: BarcodeScanner, public http: Http) {
    
  }

  scanBarcode(){

    console.log('Course ID =',this.courseid);
    console.log('Group =',this.groupnum);
    console.log('Score =',this.score);
    console.log('FixScore =',this.fixscore);

    if(this.fixscore){
      if(this.score){
        console.log('Score is fix');
        this.cameraScanner();
      }else{
        let alert = this.alerCtrl.create({
          title: 'Invalid!',
          message: 'Please input score!',
          buttons: ['Ok']
        });
        alert.present()
      }
    }else{
      console.log('Score is not fix');
    }
    
  }
  cameraScannerTest(){
    this.student_id = 'B5111299';
    this.httpPost();
  }

  cameraScanner(){
    console.log('Camera Scanner');

    this.barcodeScanner.scan(this.scanOption).then(barcodeData => {
      
      this.student_id = barcodeData.text;
            
      if(barcodeData.cancelled==false){
        this.httpPost();
        this.cameraScanner();
      }
      
    }, (err) => {
      console.log('Error: ', err);
    });
  }

  httpPost(){
    console.log(this.student_id);
    console.log(this.groupnum);
    console.log(this.score);

    var myData = JSON.stringify({student_id: this.student_id, group: this.groupnum, score: this.score, spreadsheetId: this.spreadsheetId, namesheet: this.namesheet});
    this.http.post(this.link, myData).map(res => res.json())
      .subscribe(data => {
        console.log(data[0]['status']);
        if(data[0]['status']!='2'){
          let alert = this.alerCtrl.create({
            title: 'Error',
            subTitle: 'Cannot insert the data to google sheet!',
            buttons: ['OK']
          });
          alert.present();
        }
      }, error => {
        console.log('Error: ', error);
      });
  }

  logout(){
     let confirm = this.alerCtrl.create({
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Ok');
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    confirm.present();
  }
}
