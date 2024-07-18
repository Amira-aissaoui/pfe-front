import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { delay ,take} from 'rxjs';
@Component({
  selector: 'app-generatingdashloading',
  templateUrl: './generatingdashloading.component.html',
  styleUrls: ['./generatingdashloading.component.css']
})
export class GeneratingdashloadingComponent {
  ngOnInit(){
    interval(12 * 1000) 
    .pipe(
      take(1),
      delay(12 * 1000) 
    )
    .subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
 
    
  }
  constructor(private router: Router) {}

}
