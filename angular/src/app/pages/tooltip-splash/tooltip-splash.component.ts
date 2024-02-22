import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-tooltip-splash',
  templateUrl: './tooltip-splash.component.html',
  styleUrls: ['./tooltip-splash.component.css']
})
export class TooltipSplashComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/create-project']);
    }, 5000);
  }
}
