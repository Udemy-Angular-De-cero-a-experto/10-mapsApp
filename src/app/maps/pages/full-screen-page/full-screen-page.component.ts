import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map } from 'mapbox-gl';

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css'
})
export class FullScreenPageComponent implements AfterViewInit {

  @ViewChild( 'map' ) divMap?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {

    if ( !this.divMap ) throw Error( 'El elemento HTML no existe.' );

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-0.9351139158522058, 41.653004385548186 ], // starting position [lng, lat]
      zoom: 15, // starting zoom
    });
  }

}
