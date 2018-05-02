import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  email:any;
  password:any;
  fname:any;
  lname:any;
  spreadsheetId:any;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, public alerCtrl: AlertController, public navCtrl: NavController, public loadingCtrl: LoadingController) {

  }

  async insert2Firebase(){
    console.log('email = ',this.email);
    console.log('password = ',this.password);
    console.log('fname = ',this.fname);
    console.log('lname = ',this.lname);
    console.log('spreadsheetId = ',this.spreadsheetId);

    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password);
      if (result) {
        let loading = this.loadingCtrl.create({
          content: "Please wait...",
          duration: 3000
        });   
        loading.onDidDismiss(() => {
          console.log('Login');
          const user = this.db.object('/users/'+this.afAuth.auth.currentUser.uid);
          user.set({  username:this.email,
                      password:this.password,
                      fname:this.fname,
                      lname:this.lname,
                      spreadsheetId:this.spreadsheetId
                    })
          let alert = this.alerCtrl.create({
              title: 'Signup Successfully !',
              message: 'You can login with your email and password.',
              buttons: ['Ok']
            });
          alert.present()

          this.delay().then(()=>{
            this.navCtrl.popToRoot();
          })
        });
      
        loading.present();
      } 
    }
    catch (e) {
      console.error(e);
      var errorMessage;
      switch (e.code) {
        case 'auth/argument-error': 
                errorMessage = 'auth/argument-error';
                break;
        case 'auth/email-already-in-use': 
                errorMessage = 'auth/email-already-in-use';
                break;
        case 'auth/invalid-email':        
                errorMessage = 'auth/invalid-email';
                break;
        case 'auth/operation-not-allowed':  
                errorMessage = 'auth/operation-not-allowed';
                break;
        case 'auth/weak-password': 
                errorMessage = 'auth/weak-password';
                break;
    }
    let alert = this.alerCtrl.create({
      title: 'Sigup Error',
      subTitle: errorMessage,
      buttons: ['OK']
    });
    alert.present();
    }
  }

  delay(){
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(true);
      },1000);
    });
  }
}
