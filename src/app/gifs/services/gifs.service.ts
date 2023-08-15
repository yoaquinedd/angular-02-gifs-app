import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[]=[]

  private _tagsHistory: string[] = [];
  private apikey: string = 'ixd2VL0Qd8zlYXmI20oRT9473Y2ZN33I';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs'


  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagHistory() {
    return [...this._tagsHistory];
  }

  // Metodo que sirve para:
  // Pasar el tag a minusculas,
  // si el tag ya se encuentra en el historial lo saca y lo agrega pero al principio,
  // y controla que el historial no sea de mas de 10 tags
  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory) )
  }

  private loadLocalStorage():void{

    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!) ;

    if (this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);
  }


  searchTag(tag: string): void {

    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('limit', '10')
      .set('q', tag);

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params: params})
      .subscribe( resp =>{ //el subscribe sirve para escuchar la respuesta de la peticion realizada
        this.gifList = resp.data;
        console.log({gifs: this.gifList})
      } );
  }


  // ESTA ES UNA FORMA DE HACERLO PERO ES
  // PROPIA DE JAVASCRIPT Y NO SE PUEDEN OCUPAR SUBSCRIBERS
  // Y UN FETCH NO SE PUEDE CANCELAR ENTRE OTROS


  // async searchTag(tag:string):Promise<void>{

  //   if ( tag.length===0 ) return;

  //   this.organizeHistory(tag);

  //   const resp = await fetch('http://api.giphy.com/v1/gifs/search?api_key=ixd2VL0Qd8zlYXmI20oRT9473Y2ZN33I&q=valorant&limit=10')
  //   const data = await resp.json();

  //   console.log(data);
  // }




}
