import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CookieService } from 'ngx-cookie-service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: any;
  projects: any[] = [];
  selectedProject: any = null;
  officerId!: any;

  constructor(
    private projService: ProjectService, 
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.officerId = this.cookieService.get('user_id') || 0;
    console.log("officerId", this.officerId);

    // Fetch the projects of the officer
    this.projService.fetchProjectsOfOfficerForMap(this.officerId).subscribe({
      next: (value) => {
        console.log(value);
        this.projects = value;
        this.initializeMap(); 
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }

  // Initialize the map
  initializeMap(): void {
    if (this.projects && this.projects.length > 0) {
      this.map = L.map('map').setView([28.7041, 77.1025], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      // Custom marker icon
      const customIcon = L.icon({
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Add markers for all projects on the map
      this.projects.forEach((project: any) => {
        const marker = L.marker([project.proj_latitude, project.proj_longitude], {
          icon: customIcon,
        }).addTo(this.map);

        // Bind a popup to show the project details when clicked
        marker.bindPopup(`
          <b>${project.proj_title}</b><br>
          ${project.proj_desc}
        `);

        // On marker click, show the selected project
        marker.on('click', () => {
          this.selectedProject = project;
        });
      });
    } else {
      console.warn('No projects available to display on the map.');
    }
  }

  // Show the selected project on the map
  showProjectOnMap(): void {
    if (!this.selectedProject) return;

    // Remove all existing markers
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    // Add the selected project marker
    this.addMarker(this.selectedProject);

    // Center the map on the selected project
    this.map.setView(
      [this.selectedProject.proj_latitude, this.selectedProject.proj_longitude],
      14
    );
  }

  // Add marker for the selected project with popup
  addMarker(project: any): void {
    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    const marker = L.marker([project.proj_latitude, project.proj_longitude], {
      icon: customIcon,
    }).addTo(this.map);

    marker.bindPopup(`
      <b>${project.proj_title}</b><br>
      Location: ${project.proj_location}<br>
      Description: ${project.proj_desc}<br>
      Latitude: ${project.proj_latitude}<br>
      Longitude: ${project.proj_longitude}
    `);
  }
}
