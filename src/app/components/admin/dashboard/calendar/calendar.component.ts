import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, parseISO } from 'date-fns';
import { Subject } from 'rxjs';
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

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  public agendas: Array<Agenda>;
  public cliente: Cliente;
  public agenda: Agenda;

  activeDayIsOpen: boolean = true;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

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

  refresh: Subject<any> = new Subject();

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
    
  },*/
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,

    },];

  constructor(private modal: NgbModal, private toastr: ToastrService, private _route: ActivatedRoute, private _router: Router,
    private _agendaService: AgendaService, private _clienteservice: ClientesService, private fb: FormBuilder) { }

  getAgendas() {
    this._agendaService.getClientesAgenda().subscribe(
      result => {
        this.agendas = result;
        this.agendas.forEach(element => {
          console.log(new Date());
          console.log(element.prox_cita);
          //this.viewDate = parseISO(element.prox_cita);
        });
      },
      error => {
        console.log(<any>error);
      }
    );
  }

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

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'xl' });
  }

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

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.toastr.success('El usuario ha sido eliminado', '', { "positionClass": "toast-bottom-right" });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


  public datePickerOptions: FlatpickrDefaultsInterface = {
    allowInput: true,
    enableTime: true,
    mode: 'single',
    dateFormat: "Y-m-d H:i",
    // this:
    enable: [{ from: new Date(0, 1), to: new Date(new Date().getFullYear() + 200, 12) }]
  }

  getClientesPorId() {
    let id
    this._clienteservice.getClientesPorId(id).subscribe(
      result => {
        this.cliente = result;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getAgendasPorId() {
    let id = 1;
    this._agendaService.getClienteAgendaPorId(id).subscribe(
      result => {
        this.agenda = result;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit(): void {
    this.getAgendas();
    this.getAgendasPorId();
  }
}



