export class Agenda{
    constructor(
        public id:number,public estado:string,public donde:string,public tipo_consulta:string,public posicion:string,
        public zona_tratamiento:string, public tipo_tratamiento:string, public cortes:number, public precio:number,
        public prox_cita:Date, public cita_con:string, public comentarios:string, public idCliente:number){
    }
}