import { Injectable } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";

@Injectable({
  "providedIn": "root"
})

export class ValidacionesService{

  public cantBrStrider = (control: FormControl): ValidationErrors | null => {
    const value: string = control.value.trim().toLowerCase();

    if( value === 'strider'){
      return{
        noStrider: true
      }
    }

    return null;
  }

  validartoken(token:string | null){
    if(!token || token == null){
      return false;
    }
    return true;
  }

  isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched
  }
}


