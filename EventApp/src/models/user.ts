//Class not used

export class User {
    iduser: number;
    usertype: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;

    constructor(id: number, type: string, first:string, last:string, email:string, password:string){
        this.iduser = id;
        this.usertype = type;
        this.firstname = first;
        this.firstname = last;
        this.email = email;
        this.password = password;
    }
}