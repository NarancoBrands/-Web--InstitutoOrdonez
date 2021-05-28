import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders,  HttpResponse} from '@angular/common/http';
import {GLOBAL} from './global';
import {Subscribe} from '../models/subscribe';

@Injectable()

export class SubscribeService{
    public url: string;

    constructor(public _http:HttpClient){
        this.url=GLOBAL.url;
    }

    getRegistros(): Observable<any>{
        return this._http.get(this.url+'/mqtt/subscribe/search');
    }

    registrarse(): Observable<any>{
        return this._http.get(this.url+'/mqtt/subscribe');
    }
}