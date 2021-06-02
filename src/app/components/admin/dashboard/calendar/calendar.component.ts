import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, parseISO } from 'date-fns';
import { of, Subject } from 'rxjs';
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
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public locale: string = "es";
  public agendas: Array<Agenda>;
  public clientes: Array<Cliente>;
  public agenda: Agenda;
  public horario: any = [];
  public contadorHorario: number;
  public activeDayIsOpen: boolean = true;
  public cliente:Array<any>;

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

  //ARRAY DE EVENTOS EN EL CALENDARIO

  events: CalendarEvent[] = [/*{
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: colors.red,
    actions: this.actions,
    allDay: true,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    draggable: true,
    
  },*/];

  refresh: Subject<any> = new Subject();

  constructor(private modal: NgbModal, private toastr: ToastrService, private _route: ActivatedRoute, private _router: Router,
    private _agendaService: AgendaService, private _clienteservice: ClientesService, private fb: FormBuilder) {
  }

  //SUBSCRIBES DE LOS SERVICIOS DE AGENDAS Y CLIENTES

  getAgendas() {
    this._agendaService.getClientesAgenda().subscribe(
      result => {
        //guardamos los datos de las agendas
        this.agendas = result;
        //vamos a buscar los clientes
        this.agendas.forEach(element=>{
          this.horario=element.prox_cita;
          this.getClientesPorId(this.agendas,this.horario,element.idCliente);
        });
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getClientePorIdModal(id){
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

  //uso unico para el evento del principio
  getClientesPorId(agendaCalendario,horarioCalendario,id) {
    //guardamos por si acaso de nuevo las agendas con el dato que enviamos del metodo anterior
    this.agendas=agendaCalendario;

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

  //sacar los datos de la agenda por un id concreto
  getAgendaPorId(idModal){
    let id=idModal;
    this._agendaService.getClienteAgendaPorId(id).subscribe(
      result => {
        this.agenda=result;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //AÑADIR EVENTO DIRECTAMENTE

  añadirEvento(horario: Date, cliente): void {
    //guardamos en dos variables los datos que nos llegan
    let horarioEvento=new Date(horario);
    var clienteEvento

    //realizamos un for para guardar en una de esas variables los datos que necesitamos del modelo de cliente
    for(let i=0; i<cliente.length; i++){
      clienteEvento= [cliente[i].id,cliente[i].nombre, cliente[i].apellidos];
    }
    
    //añadimos el evento
    this.events = [
      ...this.events,
      {
        title: clienteEvento,
        start: horarioEvento,
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }


  //AÑADIR EVENTO DESDE EL MODAL

  addEvent(): void {
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
  }

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
    let id=event.title[0];
    this.modalData = { event, action };
    this.getAgendaPorId(id);
    this.getClientePorIdModal(id);
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

  cerrarModal(){
    this.modal.dismissAll();
  }

  ngOnInit(): void {
    this.getAgendas();
    
  }
}



