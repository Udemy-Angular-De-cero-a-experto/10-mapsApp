import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css'
})
export class FullScreenPageComponent implements OnInit, AfterViewInit, OnDestroy {

  private initialLngLat: LngLat = new LngLat(-0.9351139158522058, 41.653004385548186);
  private initialZoom: number = 10;
  private putMarker: boolean = false;
  private subscription?: Subscription;

  @ViewChild('map') divMap?: ElementRef<HTMLDivElement>;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParamMap.subscribe((params) => {
      if (!params.get('lng') || !params.get('lat')) this.putMarker = false;
      else {
        this.putMarker = true;
        this.initialLngLat = new LngLat( Number( params.get( 'lng' )), Number( params.get( 'lat' )));
      }

      if ( params.get( 'zoom' )) this.initialZoom = Number( params.get( 'zoom' ));
    });
  }

  ngOnDestroy(): void {
    if ( this.subscription ) this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {

    if ( !this.divMap ) throw Error( 'El elemento HTML no existe.' );

    const map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.initialLngLat, // starting position [lng, lat]
      zoom: this.initialZoom, // starting zoom
    });

    if ( this.putMarker ) {
      new Marker()
        .setLngLat( this.initialLngLat )
        .addTo( map );
    }
  }

}
