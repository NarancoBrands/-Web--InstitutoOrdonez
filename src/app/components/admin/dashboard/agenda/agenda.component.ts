import { Component, OnInit } from '@angular/core';
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr/flatpickr-defaults.service';
import { AgendaService } from '../../../../services/agenda.service';
import { ClientesService } from '../../../../services/clientes.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Agenda} from '../../../../models/agenda';
import { Cliente} from '../../../../models/cliente';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [AgendaService, ClientesService]
})
export class AgendaComponent implements OnInit {
  public agenda:Agenda;
  public clientes:Array<Cliente>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _agendaService: AgendaService, 
    private _clienteservice: ClientesService, private fb: FormBuilder) { }

  agendaForm = new FormGroup({
    estado: new FormControl(''),
    donde: new FormControl(''),
    tipo_consulta: new FormControl(''),
    posicion: new FormControl(''),
    zona_tratamiento: new FormControl(''),
    tipo_tratamiento: new FormControl(''),
    cortes: new FormControl('',[Validators.required, Validators.pattern("^[0-9]{1,9}$")]),
    precio: new FormControl('',[Validators.required, Validators.pattern("^[0-9]{1,9}$")]),
    prox_cita: new FormControl(''),
    cita_con: new FormControl(''),
    comentarios: new FormControl(''),
    idCliente: new FormControl('',[Validators.required, Validators.pattern("^[0-9]{1,10}$")]),
  });

  get cortesNoValido() {
    return this.agendaForm.get("cortes").invalid && this.agendaForm.get("cortes").touched;
  }
  get precioNoValido() {
    return this.agendaForm.get("precio").invalid && this.agendaForm.get("precio").touched;
  }
  get clienteNoValido() {
    return this.agendaForm.get("idCliente").invalid && this.agendaForm.get("idCliente").touched;
  }


  onSubmit() {
    this._agendaService.addClienteAgenda(this.agendaForm.value).subscribe(
      result => {
        this._router.navigate(['admin/dashboard/listCustomer']);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getclientes(){
    this._clienteservice.getClientes().subscribe(
      result => {
        this.clientes=result;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit(): void {
    this.getclientes();
  }

  public datePickerOptions : FlatpickrDefaultsInterface = {
    allowInput : true,
    enableTime : true,
    mode : 'single',
    dateFormat : "Y-m-d H:i",
    // this:
    enable : [{from : new Date(0, 1), to : new Date(new Date().getFullYear() + 200, 12)}]
  }

}
