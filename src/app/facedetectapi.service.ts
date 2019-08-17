import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class FacedetectapiService {
  enrollUrl: string =
    "https://cors-anywhere.herokuapp.com/http://api.kairos.com/enroll";

  predictUrl: string =
    "https://cors-anywhere.herokuapp.com/http://api.kairos.com/recognize";
  constructor(private httpClient: HttpClient) {}

  public enrollImage(obj) {
    return this.httpClient
      .post(this.enrollUrl, obj, {
        headers: new HttpHeaders({
          "Content-Type": "image/jpeg",
          app_id: "55c1fb7b",
          app_key: "9df35162e820c9c7d6d99f234ce00144"
        })
      })
      .pipe(map((response: any) => response));
  }

  public recognizeImage(obj) {
    return this.httpClient
      .post(this.predictUrl, obj, {
        headers: new HttpHeaders({
          "Content-Type": "image/jpeg",
          app_id: "55c1fb7b",
          app_key: "9df35162e820c9c7d6d99f234ce00144"
        })
      })
      .pipe(map((response: any) => response));
  }
}
