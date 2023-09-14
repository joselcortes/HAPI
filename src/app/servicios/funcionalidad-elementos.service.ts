import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionalidadElementosService {
  router: any;
  constructor(private aRouter: ActivatedRoute) {
  }

  //SERVICIO PARA CERRAR EL MODAL INGRESO PACIENTE
  private closeModalSubject = new Subject<void>();
  closeModal$ = this.closeModalSubject.asObservable();

  close() {
    this.closeModalSubject.next();
  }

}
