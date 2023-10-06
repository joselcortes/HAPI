import { Component } from '@angular/core';
import { LoginService } from '../servicios/login.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup
  public messages2:any;
  public email:string;
  public contrasena:string;
  public authorization:string;
  public body:{
    message:string
  }
  public status:number;
  public imgLogin:string;


  constructor(
    private loginService:LoginService,
    private router:Router,
    private toast: MessageService,
    private fb: FormBuilder,
  ){

    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })


    this.imgLogin="";
    this.email = "";
    this.contrasena = "";
    this.authorization = "";
    this.body = {
      message: ""
    }
    this.status = 0;
  }


  ngOnInit(): void {

  }

 async enviarCredenciales(){
    this.loginService.getHeader({
      emailUsuario: this.form.controls['email'].value,
      contrasenaUsuario: this.form.controls['password'].value,

    }).subscribe({
      next: (response) => {
        this.authorization=response.headers.get("Authorization");
        // this.body = response.body;
        this.status = response.status;
        localStorage.setItem("token", this.authorization);

        if(this.status == 200){

          this.router.navigate(["/inicio"]);
        }
      },
      error: (err) => {

       this.toast.add({ severity: 'error', summary: 'Error', detail: `${err.error}` });

      },
      complete(){}
    })
 }

 isValidField(field:string){
    return this.form.controls[field].errors && this.form.controls[field].touched
 }

  enviarDatos(){
    const formValue = this.form.value;
    if(this.form.invalid){
      this.form.markAllAsTouched()
      return
    }

    this.loginService.enviarDatosLogin(formValue).subscribe({
      next:(response) => {
          localStorage.setItem('token', response.token )
          if(response.login){
            this.router.navigate(["/inicio"]);
          }else{
            this.toast.add({ severity: 'error', summary: 'Error', detail: `${response.error}` });
          }
      },
      error:(error) => {
       this.toast.add({ severity: 'error', summary: 'Error', detail: `Problemas de conexión` });

      },
      complete(){}
    })

    // this.loginService.enviarDatosLogin(formValue).subscribe((res:any) => {
    //   console.log(res.login);
    //   localStorage.setItem('token', res.token )
    //   this.router.navigate(["/inicio"]);

    //   // if(res.login){
    //   //   this.loginService.verificarToken(res.token).subscribe((res) => {
    //   //     this.router.navigate(["/inicio"]);
    //   //     console.log(res);
    //   //   })
    //   // }else{
    //   //   this.toast.add({ severity: 'error', summary: 'Error', detail: `${res.error}` });
    //   // }
    // })
 }

}

