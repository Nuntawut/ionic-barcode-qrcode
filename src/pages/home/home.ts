import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import 'rxjs/add/operator/map';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  student_id:any;
  groupnum: number;
  score: number;
  fixscore:any = true;
  userid:any;

  testRadioOpen: boolean;

  public fname;

  //API Url and Google sheet id
  public link = 'https://golang-sheet-api.herokuapp.com/';
  public link2 = 'https://script.google.com/macros/s/AKfycbybYSZXgaG-xJY9Q1WByBMp1paHZJ0ZZ0qAP2sso5DRaOLZotE/exec'
 
  public spreadsheetId;
  public namesheet = 'SheetApi';

  public scanOption = {
    showTorchButton : true,
    prompt : "ให้ตำแหน่งของ barcode อยู่ภายในพื้นที่ scan",
    disableSuccessBeep: false,
    showFlipCameraButton:true,
  };

  constructor(public loadingCtrl: LoadingController, private toast: ToastController, private afAuth: AngularFireAuth, private db: AngularFireDatabase, public navCtrl: NavController, public alerCtrl: AlertController, public barcodeScanner: BarcodeScanner, public http: Http) {
    console.log("constructor")
    this.userid = this.afAuth.auth.currentUser.uid;

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    }); 
    loading.present();

    this.db.object('/users/'+this.userid).valueChanges().subscribe(data =>{
      this.fname = data['fname'];
      this.spreadsheetId = data['spreadsheetId'];
      console.log(this.fname);
      console.log(this.spreadsheetId);
      loading.dismiss();

      let toast = this.toast.create({
        message: `Welcome to SUT Barcode Scanner, ${this.fname}`,
        duration: 3000,
        position: 'top'
      });
      toast.present();

    })
  }
  
  scanBarcode(){
    
    console.log('Group =',this.groupnum);
    console.log('Score =',this.score);
    console.log('FixScore =',this.fixscore);

    if(this.fixscore){
      if(this.score){
        console.log('Score is fix');
        this.cameraScanner();
        //this.cameraScannerTest();
      }else{
        let alert = this.alerCtrl.create({
          title: 'Invalid!',
          message: 'Please input score!',
          buttons: ['Ok']
        });
        alert.present()
      }
    }else{
      this.cameraScanner();
    }
    
  }
  cameraScannerTest(){
    this.student_id = 'B5111299';
    this.httpPost();
  }

  async cameraScanner(){
    console.log('Camera Scanner');

    this.barcodeScanner.scan(this.scanOption).then(barcodeData => {
      
      this.student_id = barcodeData.text;
            
      if(barcodeData.cancelled==false){
        if(this.fixscore){
          this.httpPost();
          this.cameraScanner();
        }else{
          this.doRadio();
        }
      }
      
    }, (err) => {
      let alert = this.alerCtrl.create({
        title: 'Error',
        subTitle: 'Cannot read data from barcode or qrcode!',
        buttons: ['OK']
      });
      alert.present();
      console.log('Error: ', err);
    });
  }

  enterStudentId(){
    if(this.score){
      let prompt = this.alerCtrl.create({
        title: 'Enter Student ID.',
        inputs: [
          {
            name: 'studentid',
            placeholder: 'Student ID'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: data => {
              this.student_id = 'B'+data['studentid']
              console.log(this.student_id)
              this.httpPost();
            }
          }
        ]
      });
      prompt.present();
    }else{
      let alert = this.alerCtrl.create({
        title: 'Invalid!',
        message: 'Please input score!',
        buttons: ['Ok']
      });
      alert.present()
    }
    
  }

  async httpPost(){
    console.log(this.student_id);
    console.log(this.groupnum);
    console.log(this.score);

    var myData = JSON.stringify(
      {
            student_id: this.student_id,
            group: this.groupnum,
            score: this.score,
            spreadsheetId:this.spreadsheetId
      }
      //{course_id: this.courseid, student_id: this.student_id, group: this.groupnum, score: this.score, spreadsheetId: this.spreadsheetId, namesheet: this.namesheet}
    
    );

    this.http.post(this.link2, myData).map(res => res.json())
      .subscribe(data => {
        
        if(data['code']!=200){
          let alert = this.alerCtrl.create({
            title: 'Error',
            subTitle: 'Cannot insert the data to google sheet!',
            buttons: ['OK']
          });
          alert.present();
        }else{
          console.log("Append data successfully:");
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
            try {
              const result = this.afAuth.auth.signOut();
              if (result) {
                this.navCtrl.setRoot(LoginPage);
              }
            }
            catch (e) {
              console.error(e);
            }
          }
        }
      ]
    });
    confirm.present();
  }

  delay(){

    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(true);
      },1000);
    });
  }

  doRadio() {
    let alert = this.alerCtrl.create();
    alert.setTitle('Select Score !');

    alert.addInput({
      type: 'radio',
      label: '1 Point',
      value: '1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '2 Point',
      value: '2'
    });

    alert.addInput({
      type: 'radio',
      label: '3 Point',
      value: '3'
    });

    alert.addInput({
      type: 'radio',
      label: '4 Point',
      value: '4'
    });

    alert.addInput({
      type: 'radio',
      label: '5 Point',
      value: '5'
    });

    alert.addInput({
      type: 'radio',
      label: '6 Point',
      value: '6'
    });

    alert.addInput({
      type: 'radio',
      label: '7 Point',
      value: '7'
    });

    alert.addInput({
      type: 'radio',
      label: '8 Point',
      value: '8'
    });

    alert.addInput({
      type: 'radio',
      label: '9 Point',
      value: '9'
    });

    alert.addInput({
      type: 'radio',
      label: '10 Point',
      value: '10'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.testRadioOpen = false;
        this.score = data;
        
        this.delay().then(()=>{
          this.httpPost();
          this.cameraScanner();
        })
        
      }
    });

    alert.present().then(() => {
      this.testRadioOpen = true;
    });
  }
}
