import { Component, OnInit } from '@angular/core';
import {SubscribeService} from '../../../../services/subscribe.service';
import {Subscribe} from '../../../../models/subscribe';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css'],
  providers: [SubscribeService]
})
export class RegistrosComponent implements OnInit {
  public registros:Array<Subscribe>;

  constructor(private _route:ActivatedRoute,private _router:Router, private _registrosService: SubscribeService) {}

  getClientes(){
    this._registrosService.getRegistros().subscribe(
        result => {
            this.registros = result;
        },
        error => {
            console.log(<any>error);
        }
    );
  }

  ngOnInit() {
    this.getClientes();
  }

}
