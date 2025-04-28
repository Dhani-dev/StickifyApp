import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NavComponent } from '../../shared/components/nav/nav.component';
import { AsideComponent } from '../../shared/components/aside/aside.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, NavComponent, AsideComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

 

}
