export class Cliente{
    constructor(public user_id:number,public user_code:string,public user_name:string,public org_id:number, public pb_id:number,
    public paper_no:string,public paper_type:string,public sex:string,public nation:number, public company:string, public phone:string,
    public user_type:number,public token:string,public card_number:string,public create_time:string, public update_time:string, 
    public attendance_id:number){
        this.user_code="", this.paper_no="", this.paper_type="", this.company="", this.phone="", this.token="", this.card_number="";
    }
}