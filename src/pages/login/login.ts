import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  email:any;
  password:any;

  constructor(private afAuth: AngularFireAuth, public alerCtrl: AlertController, public navCtrl: NavController) {

  }

  async login(){

    console.log('Login');

    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
      
      if (result) {
          this.navCtrl.setRoot(HomePage);
      }  
    }
    catch (e) {
      var errorMessage;
      switch (e.code) {
        case 'auth/argument-error': errorMessage = 'auth/argument-error';
                                    break;
        case 'auth/invalid-email':  errorMessage = 'auth/invalid-email';
                                    break;
        case 'auth/user-not-found': errorMessage = 'auth/user-not-found';
                                    break;
        case 'auth/wrong-password': errorMessage = 'auth/wrong-password';
                                    break;
    }
    let alert = this.alerCtrl.create({
      title: 'Sigin Error',
      subTitle: errorMessage,
      buttons: ['OK']
    });
    alert.present();
   }
    
  }
  signup(){
    console.log('Signup');
    this.navCtrl.push(SignupPage);
  }
}
