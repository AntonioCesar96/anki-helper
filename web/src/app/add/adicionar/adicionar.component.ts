import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RootObject } from 'src/app/_common/models/models';
import { AdicionarService } from '../adicionar.service';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.component.html',
  styleUrls: ['./adicionar.component.scss']
})
export class AdicionarComponent implements OnInit {
  form!: FormGroup;
  rootObject!: RootObject;

  constructor(
    private fb: FormBuilder, 
    private adicionarService: AdicionarService) { }

  ngOnInit(): void {
    this.criarForm();


  }

  criarForm() {
    this.form = this.fb.group({
      palavra: [''],
      frase: [''],
    });
  }

    
  obterDefinicao() {
    if(!this.validarForm()) {
      return;
    }

    this.adicionarService.obterDefinicao(this.form.value.palavra)
    .subscribe(res => {
      this.rootObject = res;      
    });
    
  }
  
  validarForm() {
    if (!this.form.value.palavra) {
      return false;
    }

    return true;
  }
}
