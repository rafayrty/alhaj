import { Component, OnInit } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';

const { Haptics } = Plugins;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private route:Router,private animationCtrl: AnimationController) { }
  hapticsImpact(style = HapticsImpactStyle.Heavy) {
    // Native StatusBar available
if (Capacitor.getPlatform() != 'web') {
  Haptics.impact({
    style: style
  });
}
 
  }
  hapticsImpactLight() {
    this.hapticsImpact(HapticsImpactStyle.Light);
  }
  ngOnInit() {
  }
  async settingsBTN(e,route){
    const animation: Animation = this.animationCtrl.create()
    .addElement(e.target)
    .duration(300)
    .keyframes([
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(0.8)' },
      { offset: 1, transform: 'scale(1)' }
    ]);
    this.hapticsImpactLight();

    await animation.play().then(e=>{
      this.route.navigate([route]);
    });

  }

}
