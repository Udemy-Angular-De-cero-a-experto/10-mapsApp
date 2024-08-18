import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild( 'map' ) divMap?: ElementRef<HTMLDivElement>;

  public map?: Map;
  public currentZoom: number = 13;
  public currentCenter: LngLat = new LngLat(-0.9351474528932329, 41.652537204818685);
  public markers: MarkerAndColor[] =[];

  ngAfterViewInit(): void {

    if ( !this.divMap ) throw Error( 'El elemento HTML no existe.' );

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenter, // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });

    this.map.on( 'click', (evt) => {
      if ( !evt.originalEvent.ctrlKey ) return;

      const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

      this.addMarker( evt.lngLat, color );
      this.flyTo( evt.lngLat, 16 );
    });

    this.readFromLocalStorage();
  }

  createMarker(): void {
    if ( !this.map ) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker( lngLat, color );

  }

  addMarker( lngLat: LngLat, color: string ): void {
    if ( !this.map ) return;

    const marker = new Marker({
      color: color,
      draggable: true,
    })
      .setLngLat( lngLat )
      .addTo( this.map );

    this.markers.push({
      color: color,
      marker: marker,
    });

    marker.on( 'dragend', () => this.saveToLocalStorage() );

    this.saveToLocalStorage();
  }

  deleteMarker ( index: number ): void {
    this.markers[ index ].marker.remove();

    this.markers.splice( index, 1 );

    this.saveToLocalStorage();
  }

  flyTo( lngLat: LngLat, zoom: number ): void {
    if ( !this.map ) return;

    this.map.flyTo({
      center: lngLat,
      zoom: zoom,
    });

    // this.map.setCenter( lngLat );
    // this.map.setZoom( zoom );
  }

  saveToLocalStorage(): void {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color: color,
        lngLat: marker.getLngLat().toArray(),
      }
    });

    localStorage.setItem( 'plainMarkers', JSON.stringify( plainMarkers ));
  }

  readFromLocalStorage(): void {
    const plainMarkersString = localStorage.getItem( 'plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString );

    plainMarkers.forEach( ({ color, lngLat }) => {
      const [ lng, lat ] = lngLat;
      const coords = new LngLat( lng, lat );

      this.addMarker( coords, color );
    });
  }

}
