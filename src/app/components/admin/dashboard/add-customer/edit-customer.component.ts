import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../../services/clientes.service';
import { Cliente } from '../../../../models/cliente';
import { GLOBAL } from '../../../../services/global';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

var moment = require('moment');
var current_timestamp = moment().format("YYYY/MM/DD hh:mm:ss");

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
  providers: [ClientesService]
})
export class EditCustomerComponent {
  public cliente: Cliente;
  public imagen: String='';

  get nombreNoValido() {
    return this.propertyForm.get("nombre").invalid && this.propertyForm.get("nombre").touched;
  }
  get apellidosNoValido() {
    return this.propertyForm.get("apellidos").invalid && this.propertyForm.get("apellidos").touched;
  }
  get telefonoNoValido() {
    return this.propertyForm.get("telefono").invalid && this.propertyForm.get("telefono").touched;
  }

  propertyForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-ZñÑ]{3,50}$")]),
    apellidos: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-ZñÑ]{3,50}\\s[a-zA-ZñÑ]{3,50}$")]),
    telefono: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{9}$")]),
    imagen: new FormControl(''),
    fecha: new FormControl(current_timestamp),
  });

  constructor(private _route: ActivatedRoute, private _router: Router, private _ClienteService: ClientesService,
    private fb: FormBuilder) { }

  fileChangeEvent(fileInput: any) {
    this.imagen = fileInput.target.files;
  }

  onSubmit() {
    if(this.imagen != ''){
      this._ClienteService.makeFileRequest(this.imagen).subscribe(
        result => {
          this.imagen=result;
          this.propertyForm.get('imagen').setValue(this.imagen);
          this.editarDato();
        },
        error => {
          console.log(<any>error);
        }
      );
    }else{
      this.editarDato();
    }
  }

  editarDato(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._ClienteService.editContact(id, this.propertyForm.value).subscribe(
        result => {
          this._router.navigate(['admin/dashboard/listCustomer']);
        },
        error => {
          console.log(<any>error);
        }
      );
    });
  }

  recogerDato() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._ClienteService.getClientesPorId(id).subscribe(
        response => {
          this.cliente = response;
          for (let i in this.cliente) {
            this.propertyForm.get('nombre').setValue(this.cliente[i].nombre);
            this.propertyForm.get('apellidos').setValue(this.cliente[i].apellidos);
            this.propertyForm.get('telefono').setValue(this.cliente[i].telefono);
            this.propertyForm.get('imagen').setValue(this.cliente[i].imagen);
          }
        }, error => {
          console.log(<any>error);
        }
      );
    });
  }

  ngOnInit() {
    this.recogerDato();
  }

}
