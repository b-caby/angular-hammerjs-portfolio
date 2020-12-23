import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('person_1') person_1: ElementRef;
  @ViewChild('person_2') person_2: ElementRef;
  @ViewChild('person_3') person_3: ElementRef;

  public displayedPerson: number = 1;
  private initialAngle_1: number = 0;
  private initialAngle_2: number = 20;
  private initialAngle_3: number = 40;

  constructor(private renderer: Renderer2) { }

  onPanMove(evt)
  {
      this.renderer.setStyle(this.person_1.nativeElement, 'transform', `rotate(${ this.initialAngle_1 + evt.deltaX / 18 }deg)`);
      this.renderer.setStyle(this.person_2.nativeElement, 'transform', `rotate(${ this.initialAngle_2 + evt.deltaX / 18 }deg)`);
      this.renderer.setStyle(this.person_3.nativeElement, 'transform', `rotate(${ this.initialAngle_3 + evt.deltaX / 18 }deg)`);
  }

  onPanEnd(evt)
  {
    if (evt.deltaX < -160 && this.displayedPerson != 3)
    {
      this.initialAngle_1 -= 20;
      this.initialAngle_2 -= 20;
      this.initialAngle_3 -= 20;
      this.displayedPerson++;
    }

    if (evt.deltaX > 160 && this.displayedPerson != 1)
    {
      this.initialAngle_1 += 20;
      this.initialAngle_2 += 20;
      this.initialAngle_3 += 20;
      this.displayedPerson--;
    }

    this.renderer.setStyle(this.person_1.nativeElement, 'transform', `rotate(${ this.initialAngle_1 }deg)`);
    this.renderer.setStyle(this.person_2.nativeElement, 'transform', `rotate(${ this.initialAngle_2 }deg)`);
    this.renderer.setStyle(this.person_3.nativeElement, 'transform', `rotate(${ this.initialAngle_3 }deg)`);
  }
}