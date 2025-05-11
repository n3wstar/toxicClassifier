import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPredictResponse} from "../data/response-models/predict.response-model.interface";

@Injectable()
export class ToxicClassificationRequestService {
    private readonly _baseUrl: string = 'http://127.0.0.1:8000/';

    private readonly _httpClient: HttpClient = inject(HttpClient);

    public sendRequest(text: string): Observable<IPredictResponse> {
        return this._httpClient.post<IPredictResponse>(this._baseUrl + 'predict', { text });
    }
}