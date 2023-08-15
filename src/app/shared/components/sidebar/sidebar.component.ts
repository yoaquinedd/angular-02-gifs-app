import { GifsService } from './../../../gifs/services/gifs.service';
import { Component } from '@angular/core';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private gifsService: GifsService){}

   get tags(){
    return this.gifsService.tagHistory;
   }

   searchTagAgain(tag:string){
    return this.gifsService.searchTag(tag);
   }
}
