import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit {

  @ViewChild( 'map' ) divMap?: ElementRef<HTMLDivElement>;

  public currentZoom: number = 9;
  public map?: Map;
  public minZoom: number = 2;
  public maxZoom: number = 18;
  public currentCenter: LngLat = new LngLat(-0.935, 41.653);

  ngAfterViewInit(): void {

    if ( !this.divMap ) throw Error( 'El elemento HTML no existe.' );

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenter, // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });

    // this.minZoom = this.map.getMinZoom();
    // this.maxZoom = this.map.getMaxZoom();

    this.mapListeners();
  }

  mapListeners(): void {
    if ( !this.map ) throw Error( 'Mapa no inicializado.');

    // Cambio del zoom en el mapa
    this.map.on( 'zoom', (evt) => {
      this.currentZoom = this.map!.getZoom();
    });

    // El zoom alcanza los límites minZoom o maxZoom
    this.map.on( 'zoomend', (evt) => {
      if ( this.map!.getZoom() < this.minZoom ) this.map!.zoomTo( 2 );
      if ( this.map!.getZoom() > this.maxZoom ) this.map!.zoomTo( 18 );
    });

    // Al mover el mapa, btener la lat y long del punto central
    this.map.on( 'moveend', (evt) => {
      this.currentCenter = this.map!.getCenter();
    });
  }

  zoomIn(): void {
    if ( this.map!.getZoom() >= this.maxZoom ) return;

    this.map!.zoomIn();
  }

  zoomOut(): void {
    if ( this.map!.getZoom() <= this.minZoom ) return;

    this.map!.zoomOut();
  }

  zoomChanged( value: string ): void {
    this.currentZoom = Number( value );
    this.map!.zoomTo( this.currentZoom );
  }

}
