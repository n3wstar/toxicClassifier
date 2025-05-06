import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class ToxicClassificationRequestService {
    private readonly _baseUrl: string = 'http://localhost:8080';

    private readonly _httpClient: HttpClient = inject(HttpClient);

    public sendRequest(text: string): Observable<any> {
        return this._httpClient.post(this._baseUrl, text);
    }
}