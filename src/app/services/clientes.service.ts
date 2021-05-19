import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders,  HttpResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {GLOBAL} from './global';
import {Cliente} from '../models/cliente';

@Injectable()

export class ClientesService{
    public url: string;

    constructor(public _http:HttpClient){
        this.url=GLOBAL.url;
    }

    getClientes(): Observable<any>{
        return this._http.get(this.url+'/users/search');
    }

    deleteCliente(id){
        return this._http.get(this.url+'/users/delete/'+id);
    }
}