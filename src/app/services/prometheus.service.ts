import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';


interface MetricQueryResult {
  status: string;
  data?: { resultType: string; result: any[] };
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class PrometheusService {
  constructor(private http: HttpClient) {}

  checkMetricInstance(metricName: string, instance?: string): Observable<boolean> {
    const url = new URL('api/v1/targets', 'http://http://localhost:9090/');
    url.searchParams.set('query', `"${metricName}"{${instance ? `instance="${instance}"` : ''}}`);

    return this.http.get<MetricQueryResult>(url.toString())
      .pipe(
        map(response => {
          if (response.status === 'success' && response.data?.resultType === 'vector') {
            return response.data.result.length > 0; // Metric exists if there's at least one sample
          } else {
            throw new Error(`Prometheus query failed: ${response.error || 'Unknown error'}`);
          }
        }),
        catchError(error => {
          console.error('Error checking metric instance:', error);
          return of(false); // Return false on error to indicate non-existence (optional)
        })
      );
  }
}