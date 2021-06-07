import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders,  HttpResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {GLOBAL} from './global';
import {Agenda} from '../models/agenda';

@Injectable()

export class AgendaService{
    public url: string;

    constructor(public _http:HttpClient){
        this.url=GLOBAL.url;
    }

    getClientesAgenda(): Observable<any>{
        return this._http.get(this.url+'/dates/search');
    }

    deleteClienteAgenda(id){
        return this._http.get(this.url+'/dates/delete/'+id);
    }

    addClienteAgenda(agenda:Agenda):Observable<any>{
        return this._http.post(this.url+'/dates/add', agenda);
    }

    editClienteAgenda(id, agenda:Agenda):Observable<any>{
        return this._http.post(this.url+'/dates/update/'+id, agenda);
    }

    getClienteAgendaPorId(id): Observable<any>{
        return this._http.get(this.url+'/dates/search/'+id);
    }

    editTornoAgenda(estado, id):Observable<any>{
        console.log(estado);
        console.log(id);
        return this._http.post(this.url+'/torno/update/'+id, estado);
    }
}