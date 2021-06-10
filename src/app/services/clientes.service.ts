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

    getClientesPorId(id): Observable<any>{
        return this._http.get(this.url+'/users/search/'+id);
    }

    deleteCliente(id){
        return this._http.get(this.url+'/users/delete/'+id);
    }

    addContact(cliente:Cliente):Observable<any>{
        return this._http.post(this.url+'/users/add', cliente);
    }

    editContact(id, cliente:Cliente):Observable<any>{
        return this._http.post(this.url+'/users/update/'+id, cliente);
    }

    makeFileRequest(File): Observable<any>{
        console.log(File);
        const fd= new FormData();
        fd.append('archivos',File[0], File[0].name);
        
        return this._http.post(this.url+'/users/images',fd);
    }

    
}