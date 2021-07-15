import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonService } from "../common.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  serverUrl = environment.serverUrl
  constructor(private common: CommonService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
  	this.getTeam();
  }
  team = [];
  showTeam = false;
  companyDetail : {};
  showAddress: false;
  getTeam(){
  	this.common.commonService({}, "GET", "common/getteam").subscribe(
      (data: any) => {
        this.team = data.profiles;
        this.showTeam = data.showTeam;
        this.companyDetail = data.companyDetail;
        for(let i=0;i<this.team.length;i++){
          if(this.team[i].designation)
          this.team[i].designation = this.sanitizer.bypassSecurityTrustHtml(this.team[i].designation);

          if(this.team[i].description1)
          this.team[i].description1 = this.sanitizer.bypassSecurityTrustHtml(this.team[i].description1);
          if(this.team[i].description2)
          this.team[i].description2 = this.sanitizer.bypassSecurityTrustHtml(this.team[i].description2);
          if(this.team[i].description3)
          this.team[i].description3 = this.sanitizer.bypassSecurityTrustHtml(this.team[i].description3);
          if(this.team[i].description4)
          this.team[i].description4 = this.sanitizer.bypassSecurityTrustHtml(this.team[i].description4);
          if(this.team[i].description5)
          this.team[i].description5 = this.sanitizer.bypassSecurityTrustHtml(this.team[i].description5);
          if(this.team[i].description6)
          this.team[i].description6 = this.sanitizer.bypassSecurityTrustHtml(this.team[i].description6);
        }
        for(const [key, value] of Object.entries(this.companyDetail)){
          if(key === 'showAddress' || key === 'showMap'){
            continue;
          }
          else if(key === 'mapUrl'){
            
            this.companyDetail[key] = this.sanitizer.bypassSecurityTrustResourceUrl(this.companyDetail[key]);
          }
          else{
            this.companyDetail[key] = this.sanitizer.bypassSecurityTrustHtml(this.companyDetail[key]);

          }
        }
        
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
