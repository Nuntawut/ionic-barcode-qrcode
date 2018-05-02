import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {

  }

  login(){
    
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
  
    loading.onDidDismiss(() => {
      console.log('Login');
      this.navCtrl.setRoot(HomePage);
    });
  
    loading.present();
    
  }
  signup(){
    console.log('Signup');
  }
}
