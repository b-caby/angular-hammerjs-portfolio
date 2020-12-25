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
  @ViewChild('blob') blob: ElementRef;
  @ViewChild('bubble') bubble: ElementRef;
  @ViewChild('word') word: ElementRef;

  public displayedPerson: number = 1;
  public displayedText: string;
  private initialAngle_1: number = 0;
  private initialAngle_2: number = 20;
  private initialAngle_3: number = 40;
  private isBubbleLeft: boolean = true;
  private bubbleRight: string = "m 92.911375,41.57637 c 0.169244,0.718222 0.686447,4.262671 0.686447,4.262671 0,0 1.455236,6.148618 -6.926546,9.381018 C 78.28956,58.452459 57.206347,60.0455 50.506303,56.7901 43.806367,53.5347 42.969226,46.053 42.969226,46.053 c 0,0 -2.95295,2.5915 -9.532323,-2.7878 6.888669,1.4689 9.309452,-1.8201 9.309452,-1.8201 0,0 -0.06817,-9.1872 6.67833,-12.3347 6.746499,-3.1474 26.462807,-2.4991 32.891042,0.4628 6.428236,2.962 7.944683,6.222282 7.944683,6.222282 0,0 2.436576,4.871017 2.650965,5.780888 z";
  private bubbleLeft: string = "m 65.12929,40.738971 c -5.872488,5.03082 -8.987585,0.274199 -8.987585,0.274199 0,0 -1.04613,6.509129 -6.87819,10.479958 C 43.431455,55.463957 17.256116,55.562 12.595934,50.935871 7.9357524,46.309742 7.892,41.061909 7.892,41.061909 c 0,0 -0.4956477,-2.859713 -0.6,-4.394774 -0.1043523,-1.535061 -3.009e-4,-4.796081 -3.009e-4,-4.796081 0,0 0.1781227,-4.803838 6.2971959,-8.909054 6.119073,-4.105216 34.000757,-4.009075 39.173544,1.597061 5.172787,5.606136 3.948262,13.035072 3.948262,13.035072 0,0 2.330748,4.361814 8.418589,3.144838 z";

  constructor(private renderer: Renderer2) { }

  // Initialization after view initialization to be able to render properly.
  ngAfterViewInit()
  {
    this.displayedText = translation.translations[0]["1"];
    let left = translation.translations[0]['1-left'];
    this.renderer.setStyle(this.word.nativeElement, 'left', `${left}px`); 
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
      this.moveBubble(bubble, this.displayedPerson % 2 === 0);
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
    let isPersonLeftDisplayed = this.displayedPerson % 2 === 0
    let bubble = isPersonLeftDisplayed ? this.bubbleRight : this.bubbleLeft;
    this.isBubbleLeft = isPersonLeftDisplayed ? false : true; 
    this.moveBubble(bubble, isPersonLeftDisplayed);

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

  moveBubble(bubblepath: string, isPersonLeftDisplayed: boolean)
  {
    this.renderer.setStyle(this.bubble.nativeElement, 'd', `path('${ bubblepath }')`);
    this.renderer.setStyle(this.bubble.nativeElement, 'transition', '2s');

    if (isPersonLeftDisplayed)
    {
      this.renderer.setStyle(this.blob.nativeElement, 'left', '61px');
    }
    else
    {
      this.renderer.setStyle(this.blob.nativeElement, 'left', '33px');
    }

    this.renderer.setStyle(this.blob.nativeElement, 'transition-property', 'left');
    this.renderer.setStyle(this.blob.nativeElement, 'transition-duration', '2s');
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
      this.renderer.setStyle(this.word.nativeElement, 'top', '174px');
    }
    else
    {
      this.renderer.setStyle(this.word.nativeElement, 'top', '160px');
    }

    let left = translation.translations[0][`${displayedPerson}-left`];
    this.renderer.setStyle(this.word.nativeElement, 'left', `${left}px`);
    this.displayedText = translation.translations[0][`${displayedPerson}`];

    this.renderer.setStyle(this.word.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.word.nativeElement, 'transition-property', 'opacity');
    this.renderer.setStyle(this.word.nativeElement, 'transition-duration', '1s');
    this.renderer.setStyle(this.word.nativeElement, 'transition-timing-function', 'cubic-bezier(1,0,1,0)');
  }
}