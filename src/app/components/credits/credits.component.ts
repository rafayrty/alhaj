import { Component, OnInit } from '@angular/core';
import { Plugins, KeyboardInfo } from '@capacitor/core';

const { Keyboard } = Plugins;
@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit {

  constructor() { 
    Keyboard.addListener('keyboardWillShow', (info: KeyboardInfo) => {
document.querySelector('#credits').classList.add('hide');
    });
    Keyboard.addListener('keyboardWillHide', () => {
      document.querySelector('#credits').classList.remove('hide');
    });
  }

  ngOnInit() {}

}
