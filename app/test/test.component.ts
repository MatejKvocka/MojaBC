import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <h2>
    Welocome {{name}}
    </h2>
    <input [id]="myId" type="text" value="Matej">`,
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
   public name = "Jozo";
   public siteUrl = window.location.href;
   public myId = "testId";
  constructor() { }

  ngOnInit(): void {
  }

  greetUser(){
    return "Hello" + this.name;
  }

}
