import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: any;
  projects!: any
  selectedProject: any = null;

  approvedProjects: any[] = [];

  constructor(private projService: ProjectService) {}

  ngOnInit(): void {
    this.projService.fetchApprovedProjects().subscribe((value) => {
      console.log(value);
      this.projects = value

      this.approvedProjects = this.projects;  
      this.initializeMap();
    });
  }

  initializeMap(): void {
    this.map = L.map('map').setView([28.7041, 77.1025], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.approvedProjects.forEach((project: any) => {
      const customIcon = L.icon({
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', 
        iconSize: [25, 41], 
        iconAnchor: [12, 41], 
        popupAnchor: [1, -34], 
      });

      const marker = L.marker([project.proj_latitude, project.proj_longitude], {
        icon: customIcon,
      }).addTo(this.map);

      marker.bindPopup(`
        <b>${project.proj_title}</b><br>
        ${project.proj_desc}
      `);

      // On marker click, show project insights
      marker.on('click', () => {
        this.selectedProject = project;
      });
    });
  }

  showProjectOnMap(): void {
  if (!this.selectedProject || !this.selectedProject.proj_latitude || !this.selectedProject.proj_longitude) {
    console.error('Invalid project selected:', this.selectedProject);
    return;
  }

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


  addMarker(project: any): void {
    const customIcon = L.icon({
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', 
      iconSize: [25, 41], 
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34], 
    });

    const marker = L.marker([project.proj_latitude, project.proj_longitude], {
      icon: customIcon,
    }).addTo(this.map);

    marker.bindPopup(`
      <b>${project.proj_title}</b><br>
      ${project.proj_desc}
    `);



  }
}
