import { Component, OnInit, OnDestroy } from '@angular/core';
import { GrafanaService } from '../services/grafana.service';
import { Observable, Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-widgetgrafana',
  templateUrl: './widgetgrafana.component.html',
  styleUrls: ['./widgetgrafana.component.css']
})
export class WidgetgrafanaComponent  {
/*  uid = 'grafexport';
  panelId = '4';
  dashboard: any;
  panel: any;
  panelUrl!: string;

  private pollSubscription!: Subscription;

  constructor(private grafanaService: GrafanaService) { }

  ngOnInit(): void {
    this.pollPanel();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  pollPanel(): void {
    const pollInterval = 5000;
    this.pollSubscription = interval(pollInterval).pipe(
      switchMap(() => this.grafanaService.getPanel(this.uid, this.panelId))
    ).subscribe(response => {
      this.panel = response;
      this.panelUrl = this.getPanelUrl();
      console.log('Panel:', this.panelUrl);

      console.log("updated");
    });
  }

  stopPolling(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
      console.log("stop !");
    }
  }

  getPanelUrl(): string {
    if (this.panel) {
      const from = Date.now() - 24 * 60 * 60 * 1000; 
      const to = Date.now();
      console.log("updated 2");
      return `${this.panel.url}&from=${from}&to=${to}`;
    }
    console.log("updated 2.2");
    return '';
  }*/
}
