import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Zollab';
  isProgressBarVisible:boolean=true
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleProgressBarVisibility(event.url);
      }
    });
  }

  private handleProgressBarVisibility(url: string): void {
    if (url.includes('/chat-dashboard')) {
      this.hideProgressBar();
    } else {
      this.showProgressBar();
    }
  }

  private showProgressBar(): void {
    this.isProgressBarVisible=true;
  }

  private hideProgressBar(): void {
    this.isProgressBarVisible=false;
  }

}
