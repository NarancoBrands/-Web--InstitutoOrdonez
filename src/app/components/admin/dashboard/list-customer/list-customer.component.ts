import { Component, OnInit, ViewChild,  TemplateRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {ClientesService} from '../../../../services/clientes.service';
import {Cliente} from '../../../../models/cliente';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.css'],
  providers: [ClientesService]
})
export class ListCustomerComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  public clientes:Array<Cliente>;
  public idModal;

  constructor(private toastr: ToastrService, private _route:ActivatedRoute,private _router:Router, 
  private _ClientesService: ClientesService, private modal: NgbModal) {}

  acceptDelete(id){
    this._ClientesService.deleteCliente(id).subscribe(
      response => {
        this.getClientes();
      },
      error =>{
          console.log(<any> error);
      }
    )
    this.toastr.success('El usuario ha sido eliminado','',{ "positionClass" : "toast-bottom-right"});
    this.modal.dismissAll();
  }

  getClientes(){
    this._ClientesService.getClientes().subscribe(
        result => {
            this.clientes = result;
        },
        error => {
            console.log(<any>error);
        }
    );
  }

  abrirModal(id) {
    this.modal.open(this.modalContent, { size: 'lg' });
    this.idModal=id;
  }


  ngOnInit() {
    this.getClientes();
  }
}
