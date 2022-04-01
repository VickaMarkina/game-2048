import { Component, HostListener, OnInit } from '@angular/core';
import { Item } from './models/item';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  colorMap: {[k: number]: string} = {
    2: 'rgb(233, 212, 30)',
    4: 'rgb(88, 233, 30)',
    8: 'rgb(26, 184, 105)',
    16: 'rgb(26, 184, 171)',
    32: 'rgb(158, 26, 184)',
    64: 'rgb(184, 26, 92)',
    128: 'rgb(247, 107, 14)',
    256: 'rgb(175, 104, 11)',
    512: 'rgb(150, 175, 11)',
    1024: 'rgb(14, 119, 88)',
    2048: 'rgb(47, 104, 168)',
    4096: 'rgb(114, 19, 98)',
    8192: 'rgb(194, 41, 49)',
    16384: 'rgb(194, 158, 41)',
    32768: 'rgb(4, 102, 12)',
    65536: 'rgb(109, 181, 199)'
  }

  keyEventCodeMap: {[type: string]: string} = {
    ArrowRight: 'right',
    ArrowLeft: 'left',
    ArrowUp: 'up',
    ArrowDown: 'down'
  }

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

  getStyles(item: Item ): {[p: string]: any}{
    const availableScreenWidth = window.screen.availWidth
    const top = availableScreenWidth >= 500 ? (15 + (item.row - 1) * 115) + 'px' : (5 + (item.row - 1) * 75) + 'px';
    const left = availableScreenWidth >= 500 ? (15 + (item.col - 1) * 115) + 'px' : (5 + (item.col - 1) * 75) + 'px';

    return {top, left, 'background-color': this.colorMap[item.value] || 'rgb(68, 82, 85)'}
  }

  @HostListener('window:keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    if (this.keyEventCodeMap[event.code] === 'right') {
      this.gameService.right()
    } 
    if (this.keyEventCodeMap[event.code] === 'left') {
      this.gameService.left()
    }     
    if (this.keyEventCodeMap[event.code] === 'up') {
      this.gameService.up()
    }     
    if (this.keyEventCodeMap[event.code] === 'down') {
      this.gameService.down()
    } 

  }

  defaultTouch = { x: 0, y: 0, time: 0 };

    @HostListener('touchstart', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    handleTouch(event: any) {
        let touch = event.touches[0] || event.changedTouches[0];

        if (event.type === 'touchstart') {
            this.defaultTouch.x = touch.pageX;
            this.defaultTouch.y = touch.pageY;
            this.defaultTouch.time = event.timeStamp;
        } else if (event.type === 'touchend') {
            let deltaX = touch.pageX - this.defaultTouch.x;
            let deltaY = touch.pageY - this.defaultTouch.y;
            let deltaTime = event.timeStamp - this.defaultTouch.time;

            if (deltaTime < 500) {
                if (Math.abs(deltaX) > 60) {
                    if (deltaX > 0) {
                        this.gameService.right()
                    } else {
                        this.gameService.left()
                    }
                }

                if (Math.abs(deltaY) > 60) {
                    if (deltaY > 0) {
                        this.gameService.down()
                    } else {
                        this.gameService.up()
                    }
                }
            }
        }
    }
}
