import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, parseISO } from 'date-fns';
import { of, Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, DAYS_OF_WEEK, CalendarEventTitleFormatter } from 'angular-calendar';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CalendarService } from "./calendar.service";
import { AgendaService } from '../../../../services/agenda.service';
import { ClientesService } from '../../../../services/clientes.service';
import { Agenda } from '../../../../models/agenda';
import { Cliente } from '../../../../models/cliente';
import { FlatpickrDefaultsInterface } from 'angularx-flatpickr/flatpickr-defaults.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { elementAt } from 'rxjs/operators';
import { element } from 'protractor';
import { el } from 'date-fns/locale';

moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
    doy: 0,
  },
});

//colores para usar en el calendario
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CalendarService,
    }, AgendaService, ClientesService
  ],
})

export class CalendarComponent implements OnInit {
  //modal
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  //vista de tipo calendario mes
  public view: CalendarView = CalendarView.Month;
  //variable de tipo calendario
  public CalendarView = CalendarView;
  //vista de tipo fecha
  public viewDate: Date = new Date();
  //variable (aún sin uso) para cambiar el idioma del calendario a español
  public locale: string = "es";
  //array de agendas (datos de la tabla calendario)
  public agendas: Array<Agenda>;
  //array de clientes (datos de la tabla usuarios)
  public clientes: Array<Cliente>;
  //array vacio para guardar exclusivamente los horarios
  public horario: any = [];
  //contador para el array mencionado anteriormente
  public contadorHorario: number;
  //variable booleana para comprobar el dia que fue elegido
  public activeDayIsOpen: boolean = false;
  //segunda variable de array de clientes (datos de la tabla clientes)
  public cliente: Array<any>;
  //variable para modificar el horario
  public horarioModificable;
  //segunda variable de array de la agenda (datos de la tabla calendario)
  public agenda = [];
  //variables para modificar los datos dependiendo del select
  public selected: FormControl = new FormControl(null);
  public opc: any;

  //formuario para cambiar el estado de una persona
  estadoForm = new FormGroup({
    estado: new FormControl(''),
  });

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  //ACCIONES EN EL COLLAPSE DEL CALENDARIO
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    /*{
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },*/
  ];

  //array de eventos del calendario
  events: CalendarEvent[] = [];

  //variable para refrescar la página?
  refresh: Subject<any> = new Subject();

  constructor(private modal: NgbModal, private toastr: ToastrService, private _route: ActivatedRoute, private _router: Router,
    private _agendaService: AgendaService, private _clienteservice: ClientesService, private fb: FormBuilder) {
  }

  //SUBSCRIBES DE LOS SERVICIOS DE AGENDAS Y CLIENTES
  //------------------------------------------------------------------------------------------------------------------------
  //metodo para sacar todos los datos de la tabla calendario
  getAgendas() {
    //subscribe
    this._agendaService.getClientesAgenda().subscribe(
      result => {
        //guardamos los datos de las agendas
        this.agendas = result;
        //vamos a buscar los clientes
        this.agendas.forEach(element => {
          //guardamos en una variable horario solamente la fecha de la cita
          this.horario = element.prox_cita;
          
          //llamamos al metodo para sacar un cliente por el id y pasamos el id del cliente la agenda y el horario
          this.getClientesPorId(this.agendas, this.horario, element.idCliente);
        });
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  /*este metodo es usado cuando queremos saber los datos de un cliente a través del modal el cual se llama clickando a un cliente
  en el calendario*/
  getClientePorIdModal(id) {
    //subscribe del cliente que necesitamos
    this._clienteservice.getClientesPorId(id).subscribe(
      result => {
        //guardamos en una variable el resultado
        this.cliente = result;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //solamente se usa cuando se entra por primera vez a la página
  getClientesPorId(agendaCalendario, horarioCalendario, id) {
    //guardamos por si acaso de nuevo las agendas con el dato que enviamos del metodo anterior
    this.agendas = agendaCalendario;
    //subscribe del cliente que necesitamos
    this._clienteservice.getClientesPorId(id).subscribe(
      result => {
        //guardamos en una variable el resultado
        this.cliente = result;
        //metodo para añadir un evento
        this.añadirEvento(horarioCalendario, this.cliente);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //metodo para añadir eventos y se muestren en el calendario (solamente se usa cuando se entra por primera vez a la página)
  añadirEvento(horario: Date, cliente): void {
    //guardamos en dos variables los datos que nos llegan
    let horarioEvento = new Date(horario);
    var clienteEvento

    //realizamos un for para guardar en una de esas variables, los datos que necesitamos del modelo de cliente
    for (let i = 0; i < cliente.length; i++) {
      clienteEvento = [cliente[i].id, cliente[i].nombre, cliente[i].apellidos];
    }
    //añadimos el evento
    this.events = [
      ...this.events,
      {
        title: clienteEvento, //variable con los datos del cliente
        start: horarioEvento, //variable con el horario de la agenda en tipo date
        color: colors.red, //color que queremos para el evento
        draggable: true, //sirve para interactuar con el evento y moverlo pero no está funcional
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    this.refresh.next();
  }

  //sacar los datos de la agenda por un id concreto
  getAgendaPorId(idModal) {
    //recogemos el id del cliente que fue clickado
    let id = idModal;
    //realizamos un subscribe ya que ese id coincide con el campo foráneo llamado idCliente del modelo de agenda
    this._agendaService.getClienteAgendaPorId(id).subscribe(
      result => {
        //inicializamos una segunda variable llamada agenda para guardar los datos en caso de que haya varias citas
        this.agenda = [];
        //realizamos un for each
        result.forEach(element => {
          //por si acaso pasamos a date la cita para que no haya ningun error
          let cita = new Date(element.prox_cita);
          //si el horario de la agenda y el horario del cliente que fue clickado es el mismo guardamos el dato
          if (cita.getTime() == this.horarioModificable.getTime()) {
            this.agenda.push(element);
          }
        });
      },
      error => {
        console.log(<any>error);
      }
    );
  }


  //AÑADIR EVENTO DESDE EL MODAL (actualmente sin uso)
  /*addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }*/

  //EVENTO DE CLICKAR EN UN DIA
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  //CAMBIOS DE EVENTOS
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  //ABRIR MODAL
  handleEvent(action: string, event: CalendarEvent): void {
    //guardamos el horario de la cita del cliente
    this.horarioModificable = event.start;
    //guardamos el id del cliente
    let id = event.title[0];
    this.modalData = { event, action };
    //llamamos al metodo para sacar las citas concretas por el id del cliente
    this.getAgendaPorId(id);
    //llamamos al metodo para conseguir al cliente concreto que necesitamos (nombre y apellidos)
    this.getClientePorIdModal(id);
    //abrimos el modal
    this.modal.open(this.modalContent, { size: 'xl' });
  }

  //BORRAR EVENTO
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.toastr.success('El usuario ha sido eliminado', '', { "positionClass": "toast-bottom-right" });
  }

  //CAMBIAR LA VISTA DEL CALENDARIO
  setView(view: CalendarView) {
    this.view = view;
  }

  //CERRAR COLLAPSE
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  //OPCIONES PARA EL MWLFLATPICKR
  public datePickerOptions: FlatpickrDefaultsInterface = {
    allowInput: true,
    enableTime: true,
    mode: 'single',
    dateFormat: "Y-m-d H:i",
    // this:
    enable: [{ from: new Date(0, 1), to: new Date(new Date().getFullYear() + 200, 12) }]
  }

  //CERRAR MODAL
  cerrarModal() {
    this.modal.dismissAll();
  }

  //en este metodo la variable opc cambia con lo seleccionado en el select
  Opciones(opc1) {
    this.opc = opc1;
  }

  //cambiar el estado de un cliente
  cambiarEstado(id) {
    if (this.opc == undefined) {
      this.opc = "Fuera de torno";
    }

    let estado = this.opc;
    this.estadoForm.get('estado').setValue(estado);

    this._agendaService.editTornoAgenda(this.estadoForm.value, id).subscribe(
      result => {
      },
      error => {
        console.log(<any>error);
      }
    );
    this.modal.dismissAll();
  }

  ngOnInit(): void {
      this.getAgendas();

      this.selected.valueChanges.subscribe(changes => {
        console.log("Changes")
        this.Opciones(changes);
      });
  }
}



