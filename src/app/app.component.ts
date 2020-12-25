import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import translation from '../assets/translation.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('person_1') person_1: ElementRef;
  @ViewChild('person_2') person_2: ElementRef;
  @ViewChild('person_3') person_3: ElementRef;
  @ViewChild('bubble') bubble: ElementRef;
  @ViewChild('word') word: ElementRef;

  public displayedPerson: number = 1;
  public displayedText: string;
  private initialAngle_1: number = 0;
  private initialAngle_2: number = 20;
  private initialAngle_3: number = 40;
  private isBubbleLeft: boolean = true;
  private bubbleRight: string = "M 95.831,41.999926 C 95.782425,42.733378 95.584,44.286053 95.584,44.286053 95.584,44.286053 96.578109,53.540644 88.819549,56.773 81.060989,60.005356 68.81591,60.045536 62.61403,56.790117 56.41215,53.534699 55.637317,46.053 55.637317,46.053 55.637317,46.053 52.903897,48.644501 46.81368,43.265233 53.190207,44.734054 55.431,41.445133 55.431,41.445133 55.431,41.445133 55.367885,32.257856 61.612783,29.110426 67.857681,25.962996 83.778709,26.611268 89.729,29.573221 95.679291,32.535174 95.883,39.889645 95.883,39.889645 95.883,39.889645 95.879575,41.266474 95.831,41.999926 Z";
  private bubbleLeft: string = "M 53.623408,41.586029 C 47.75092,46.616849 44.763419,42.445 44.763419,42.445 44.763419,42.445 44.403966,47.987178 38.571906,51.958007 32.739846,55.928836 17.256116,55.562 12.595934,50.935871 7.935752399999998,46.309742 7.892000000000003,41.061909 7.892000000000003,41.061909 7.892000000000003,41.061909 7.396352300000004,38.202196 7.292000000000002,36.667135 7.187647699999999,35.132074 7.291699100000002,31.871054 7.291699100000002,31.871054 7.291699100000002,31.871054 7.469821799999998,27.067216 13.588895,22.962 19.707968,18.856784 36.789652,18.952925 41.962439,24.559061 47.135226,30.165197 45.162,37.748282 45.162,37.748282 45.162,37.748282 47.535567,42.803005 53.623408,41.586029 Z";

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.displayedText = translation.translations[0]["1"];   
  }

  onPanMove(evt)
  {
    // Move the persons.
    if((this.displayedPerson === 1 && evt.deltaX < 0) || (this.displayedPerson === 3 && evt.deltaX > 0) || (this.displayedPerson === 2))
    {
      this.move(this.person_1, this.initialAngle_1, evt);
      this.move(this.person_2, this.initialAngle_2, evt);
      this.move(this.person_3, this.initialAngle_3, evt);

      // Move the bubble and hide the text.
      if ((this.displayedPerson === 1 && evt.deltaX < -80) || (this.displayedPerson === 3 && evt.deltaX > 80)) 
      {
        this.hideText();
        this.isBubbleLeft = false;
      }
      else if ((this.displayedPerson === 2 && evt.deltaX < -80) || (this.displayedPerson === 2 && evt.deltaX > 80))
      {
        this.hideText();
        this.isBubbleLeft = true;
      }

      let bubble = this.isBubbleLeft ? this.bubbleLeft : this.bubbleRight;
      this.moveBubble(bubble);
    }
  }

  onPanEnd(evt)
  {
    // Scroll left.
    // Double scroll only possible for person 1.
    if (evt.deltaX < -320 && this.displayedPerson === 1)
    {
      this.substractAngle(40);
      this.displayedPerson += 2;
    }
    // Single scroll possible for person 1 and 2.
    else if (evt.deltaX < -160 && this.displayedPerson !== 3)
    {
      this.substractAngle(20);
      this.displayedPerson++;
    }

    // Scroll right.
    // Double scroll only possible for person 3.
    if (evt.deltaX > 320 && this.displayedPerson === 3)
    {
      this.addAngle(40);
      this.displayedPerson -= 2;
    }
    // Single scroll possible for person 2 and 3.
    else if (evt.deltaX > 160 && this.displayedPerson !== 1)
    {
      this.addAngle(20);
      this.displayedPerson--;
    }

    // Move persons to defined positions.
    this.stopMove(this.person_1, this.initialAngle_1);
    this.stopMove(this.person_2, this.initialAngle_2);
    this.stopMove(this.person_3, this.initialAngle_3);

    // Move bubble to defined position.
    let bubble = this.displayedPerson % 2 === 0 ? this.bubbleRight : this.bubbleLeft;
    this.isBubbleLeft = this.displayedPerson % 2 === 0 ? false : true; 
    this.moveBubble(bubble);

    // Show text.
    this.showText(this.displayedPerson);
  }

  move(person: ElementRef, angle: number, event: any)
  {
    this.renderer.setStyle(person.nativeElement, 'transform', `rotate(${ angle + event.deltaX / 18 }deg)`);
    this.renderer.removeStyle(person.nativeElement, 'transition-property');
    this.renderer.removeStyle(person.nativeElement, 'transition-duration');
  }

  stopMove(person: ElementRef, angle: number)
  {
    this.renderer.setStyle(person.nativeElement, 'transform', `rotate(${ angle }deg)`);
    this.renderer.setStyle(person.nativeElement, 'transition-property', 'transform');
    this.renderer.setStyle(person.nativeElement, 'transition-duration', '0.8s');
  }

  substractAngle(angle: number)
  {
    this.initialAngle_1 -= angle;
    this.initialAngle_2 -= angle;
    this.initialAngle_3 -= angle;
  }

  addAngle(angle: number)
  {
    this.initialAngle_1 += angle;
    this.initialAngle_2 += angle;
    this.initialAngle_3 += angle;
  }

  moveBubble(bubblepath: string)
  {
    this.renderer.setStyle(this.bubble.nativeElement, 'd', `path('${ bubblepath }')`);
    this.renderer.setStyle(this.bubble.nativeElement, 'transition', '2s');
  }

  hideText()
  {
    this.renderer.setStyle(this.word.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.word.nativeElement, 'transition-property', 'opacity');
    this.renderer.setStyle(this.word.nativeElement, 'transition-duration', '0s');
    this.renderer.setStyle(this.word.nativeElement, 'transition-timing-function', 'linear');
  }

  showText(displayedPerson: number)
  {
    if (displayedPerson % 2 === 0)
    {
      this.renderer.setStyle(this.word.nativeElement, 'left', '150px');
      this.renderer.setStyle(this.word.nativeElement, 'top', '170px');
    }
    else
    {
      this.renderer.setStyle(this.word.nativeElement, 'left', '50px');
      this.renderer.setStyle(this.word.nativeElement, 'top', '160px');
    }

    this.displayedText = translation.translations[0][`${displayedPerson}`];

    this.renderer.setStyle(this.word.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.word.nativeElement, 'transition-property', 'opacity');
    this.renderer.setStyle(this.word.nativeElement, 'transition-duration', '1s');
    this.renderer.setStyle(this.word.nativeElement, 'transition-timing-function', 'cubic-bezier(1,0,1,0)');
  }
}