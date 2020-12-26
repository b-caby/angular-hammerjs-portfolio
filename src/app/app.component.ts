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
  @ViewChild('bubble') bubblePath: ElementRef;
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

  ngAfterViewInit()
  {
    // Initialization after view initialization to be able to render properly.
    // Get the French word text from the JSON file.
    this.displayedText = translation.translations[0]["1"];
    // Get the Frecn word position from the JSON file.
    let left = translation.translations[0]['1-left'];
    this.renderer.setStyle(this.word.nativeElement, 'left', `${left}px`); 
  }

  onPanMove(evt)
  {
    // Do not allow anything to move if we are at the limits of the scroll.
    if((this.displayedPerson === 1 && evt.deltaX < 0) || (this.displayedPerson === 3 && evt.deltaX > 0) || (this.displayedPerson === 2))
    {
      // This allows the persons to rotate with the panValue.
      this.move(this.person_1, this.initialAngle_1, evt);
      this.move(this.person_2, this.initialAngle_2, evt);
      this.move(this.person_3, this.initialAngle_3, evt);

      // At 50% of the necessary panValue to switch, start moving the bubble.
      // Do not hide the text if this treshold value is not reached.
      // If the bubble Left is displayed, then the bubble Right need to start loading.
      // The Left person will therefore be there.
      if ((this.displayedPerson === 1 && evt.deltaX < -75) || (this.displayedPerson === 3 && evt.deltaX > 75)) 
      {
        this.hideText();
        this.moveBubble(this.bubbleRight, true);
      }
      // If the bubble Right is displayed, then the bubble Left need to start loading.
      // The Right person will therefore be there.
      else if ((this.displayedPerson === 2 && evt.deltaX < -75) || (this.displayedPerson === 2 && evt.deltaX > 75))
      {
        this.hideText();
        this.moveBubble(this.bubbleLeft, false);
      }    
    }
  }

  /**
    Private function to rotate the persons with the value of the pan.
  */
  move(person: ElementRef, angle: number, event: any)
  {
    this.renderer.setStyle(person.nativeElement, 'transform', `rotate(${ angle + event.deltaX / 18 }deg)`);
    this.renderer.removeStyle(person.nativeElement, 'transition-property');
    this.renderer.removeStyle(person.nativeElement, 'transition-duration');
  }

  /**
   * Private function to hide the text.
   */
  hideText()
  {
    // It is necessary to reset the transition because the show text id different. 
    this.renderer.setStyle(this.word.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.word.nativeElement, 'transition-property', 'opacity');
    this.renderer.setStyle(this.word.nativeElement, 'transition-duration', '0s');
    this.renderer.setStyle(this.word.nativeElement, 'transition-timing-function', 'linear');
  }

  /**
    Private function to morph to the correct bubble and position it correctly.
  */

  moveBubble(bubblepath: string, isPersonLeftDisplayed: boolean)
  {
    // Morph the bubble.
    this.renderer.setStyle(this.bubblePath.nativeElement, 'd', `path('${ bubblepath }')`);
    this.renderer.setStyle(this.bubblePath.nativeElement, 'transition', '1.3s');

    // Position the bubble correctly.
    if (isPersonLeftDisplayed) this.renderer.setStyle(this.blob.nativeElement, 'left', '61px');
    else this.renderer.setStyle(this.blob.nativeElement, 'left', '33px');
    this.renderer.setStyle(this.blob.nativeElement, 'transition-property', 'left');
    this.renderer.setStyle(this.blob.nativeElement, 'transition-duration', '1.3s');
  }

  onPanEnd(evt)
  {
    // The scrolling finger is moving towards the left of the screen.
    // Double scroll only possible for person 1.
    if (evt.deltaX < -220 && this.displayedPerson === 1)
    {
      this.substractAngle(40);
      this.displayedPerson += 2;
    }
    // Single scroll possible for person 1 and 2.
    else if (evt.deltaX < -110 && this.displayedPerson !== 3)
    {
      this.substractAngle(20);
      this.displayedPerson++;
    }

    // The scrolling finder is moving towards the right of the screen.
    // Double scroll only possible for person 3.
    if (evt.deltaX > 220 && this.displayedPerson === 3)
    {
      this.addAngle(40);
      this.displayedPerson -= 2;
    }
    // Single scroll possible for person 2 and 3.
    else if (evt.deltaX > 110 && this.displayedPerson !== 1)
    {
      this.addAngle(20);
      this.displayedPerson--;
    }

    // Snap persons to defined positions.
    this.stopMove(this.person_1, this.initialAngle_1);
    this.stopMove(this.person_2, this.initialAngle_2);
    this.stopMove(this.person_3, this.initialAngle_3);

    // Move bubble to defined position.
    // After possible multiple scrolls, we need to determine which bubble is the correct one.
    // If we display the bubble Left, then we display the person Right.
    this.isBubbleLeft = this.displayedPerson % 2 === 0 ? false : true;
    let bubble = this.displayedPerson % 2 === 0 ? this.bubbleRight : this.bubbleLeft;
    this.moveBubble(bubble, !this.isBubbleLeft);

    // Show text inside the bubble.
    this.showText(this.displayedPerson);
  }

  /**
   * Private function to snap the persons at the correct positions after the pan.
   */
  stopMove(person: ElementRef, angle: number)
  {
    this.renderer.setStyle(person.nativeElement, 'transform', `rotate(${ angle }deg)`);
    this.renderer.setStyle(person.nativeElement, 'transition-property', 'transform');
    this.renderer.setStyle(person.nativeElement, 'transition-duration', '0.8s');
  }

  /**
   * Private function to display the correct text at the correct position.
   */
  showText(displayedPerson: number)
  {
    // This handles that the correct text is displayed.
    this.displayedText = translation.translations[0][`${displayedPerson}`];

    // This handles the Y-position (top) of the text.
    if (displayedPerson % 2 === 0) this.renderer.setStyle(this.word.nativeElement, 'top', '174px');
    else this.renderer.setStyle(this.word.nativeElement, 'top', '160px');

    // This handles the X-position (left) of the text.
    let left = translation.translations[0][`${displayedPerson}-left`];
    this.renderer.setStyle(this.word.nativeElement, 'left', `${left}px`);

    // Display the text with a bezier curve (slow at the beginning).
    this.renderer.setStyle(this.word.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.word.nativeElement, 'transition-property', 'opacity');
    this.renderer.setStyle(this.word.nativeElement, 'transition-duration', '0.8s');
    this.renderer.setStyle(this.word.nativeElement, 'transition-timing-function', 'cubic-bezier(1,0,1,0)');
  }

  onFrenchClicked()
  {
    // This is necessarry because one can click on the buttons when the anmations is not finished.
    let currentDisplayed = this.displayedPerson;
    this.displayedPerson = 1;
    this.hideText();

    // If we were on UK, turn 20deg. 
    // If we were on NL, turn 40deg.
    if (currentDisplayed === 2) this.addAngle(20);
    else if (currentDisplayed === 3) this.addAngle(40);

    // Snap the position of the persons.
    this.stopMove(this.person_1, this.initialAngle_1);
    this.stopMove(this.person_2, this.initialAngle_2);
    this.stopMove(this.person_3, this.initialAngle_3);
    // Moves the bubble.
    this.moveBubble(this.bubbleLeft, false);
    // Show text inside the bubble.
    this.showText(this.displayedPerson);
  }

  onEnglishClicked()
  {
    // This is necessarry because one can click on the buttons when the anmations is not finished.
    let currentDisplayed = this.displayedPerson;
    this.displayedPerson = 2;
    this.hideText();

    // If we were on FR, turn 20deg. 
    // If we were on NL, turn 20deg.
    if (currentDisplayed === 3) this.addAngle(20);
    else if (currentDisplayed === 1) this.substractAngle(20);

    // Snap the position of the persons.
    this.stopMove(this.person_1, this.initialAngle_1);
    this.stopMove(this.person_2, this.initialAngle_2);
    this.stopMove(this.person_3, this.initialAngle_3);
    // Moves the bubble.
    this.moveBubble(this.bubbleRight, true);
    // Show text inside the bubble.
    this.showText(this.displayedPerson);
  }

  onDutchClicked()
  {
    // This is necessarry because one can click on the buttons when the anmations is not finished.
    let currentDisplayed = this.displayedPerson;
    this.displayedPerson = 3;
    this.hideText();

    // If we were on UK, turn 20deg. 
    // If we were on FR, turn 40deg.
    if (currentDisplayed === 2) this.substractAngle(20);
    else if (currentDisplayed === 1) this.substractAngle(40);

    // Snap the position of the persons.
    this.stopMove(this.person_1, this.initialAngle_1);
    this.stopMove(this.person_2, this.initialAngle_2);
    this.stopMove(this.person_3, this.initialAngle_3);
    // Moves the bubble.
    this.moveBubble(this.bubbleLeft, false);
    // Show text inside the bubble.
    this.showText(this.displayedPerson);
  }

  /**
   * Private function to substract angles.
   */
  substractAngle(angle: number)
  {
    this.initialAngle_1 -= angle;
    this.initialAngle_2 -= angle;
    this.initialAngle_3 -= angle;
  }

  /**
   * Private function to add angles.
   */
  addAngle(angle: number)
  {
    this.initialAngle_1 += angle;
    this.initialAngle_2 += angle;
    this.initialAngle_3 += angle;
  }

}