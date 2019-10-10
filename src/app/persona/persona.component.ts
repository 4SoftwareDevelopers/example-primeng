import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/model/persona';
import { PersonaService } from '../service/persona.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  personas: Persona[];
  cols: any[];
  items: MenuItem[];
  displaySaveDialog: boolean = false;
  persona: Persona = {
    id: null,
    nombre: null,
    apellido: null,
    direccion: null,
    telefono: null
  };

  selectedPersona: Persona = {
    id: null,
    nombre: null,
    apellido: null,
    direccion: null,
    telefono: null
  };

  constructor(private personaService: PersonaService, private messageService: MessageService, private confirmService: ConfirmationService) { }

  getAll() {
    this.personaService.getAll().subscribe(
      (result: any) => {
        let personas: Persona[] = [];
        for (let i = 0; i < result.length; i++) {
          let persona = result[i] as Persona;
          personas.push(persona);
        }
        this.personas = personas;
      },
      error => {
        console.log(error);
      }
    );
  }

  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedPersona != null && this.selectedPersona.id != null) {
        this.persona = this.selectedPersona;
      }else{
        this.messageService.add({severity : 'warn', summary: "Advertencia!", detail: "Por favor seleccione un registro"});
        return;
      }
    } else {
      this.persona = new Persona();
    }
    this.displaySaveDialog = true;
  }

  save() {
    this.personaService.save(this.persona).subscribe(
      (result: any) => {
        let persona = result as Persona;
        this.validarPersona(persona);
        this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se guardó la persona correctamente." });
        this.displaySaveDialog = false;

      },
      error => {
        console.log(error);
      }
    );
  }

  delete(){
    if(this.selectedPersona == null || this.selectedPersona.id == null){
      this.messageService.add({severity : 'warn', summary: "Advertencia!", detail: "Por favor seleccione un registro"});
      return;
    }
    this.confirmService.confirm({
      message: "¿Está seguro que desea eliminar el registro?",
      accept : () =>{
        this.personaService.delete(this.selectedPersona.id).subscribe(
          (result:any) =>{
            this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se eliminó la persona con id "+result.id+" correctamente." });
            this.deleteObject(result.id);
          }
        )
      }
    })
  }

  deleteObject(id:number){
    let index = this.personas.findIndex((e) => e.id == id);
    if(index != -1){
      this.personas.splice(index, 1);
    }
  }

  validarPersona(persona: Persona){
    let index = this.personas.findIndex((e) => e.id == persona.id);

    if(index != -1){
      this.personas[index] = persona;
    }else{
      this.personas.push(persona);

    }

  }
  
  ngOnInit() {
    this.getAll();
    this.cols = [
      { field: "id", header: "ID" },
      { field: "nombre", header: "Nombre" },
      { field: "apellido", header: "Apellido" },
      { field: "direccion", header: "Dirección" },
      { field: "telefono", header: "Teléfono" },
    ];

    this.items = [
      {
        label: "Nuevo",
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog(false)
      },
      {
        label: "Editar",
        icon: "pi pi-fw pi-pencil",
        command: () => this.showSaveDialog(true)
      },
      {
        label: "Eliminar", 
        icon: "pi pi-fw pi-times",
        command: () => this.delete()
      }
    ]

  }

}
