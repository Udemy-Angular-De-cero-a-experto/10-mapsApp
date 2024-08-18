import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'maps-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent implements AfterViewInit {

  @Input() lngLat?: [number, number];
  @ViewChild( 'map' ) divMap?: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if ( !this.lngLat ) throw new Error("LngLat can't be null.");
    if ( !this.divMap ) throw new Error("Map Div no found.");

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 14, // starting zoom
      interactive: false,
    });

    new Marker()
      .setLngLat( this.lngLat )
      .addTo( map );

  }

}
