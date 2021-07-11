import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../common.service";

@Component({
  selector: "app-biodata-collection",
  templateUrl: "./biodata-collection.component.html",
  styleUrls: ["./biodata-collection.component.css"],
})
export class BiodataCollectionComponent implements OnInit {
  uploadForm: FormGroup;
  userData = { name: "", mobileNumber: "", gender: "" };
  successMessage = "";
  errorMessage = "";
  campaignObj = {};
  isActiveCampaign = true;
  campaignEndTime = "";
  maleBioAmount = "";
  femaleBioAmount = "";
  allBiodata = [];
  termsandconditions = [];
  howitworks = [];
  listBioOptions = {};
  bioCount = 0;
  showListCount = false;
  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService
  ) {}

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      biodata: [""],
      photo1: [""],
      photo2: [""],
    });
    this.getCampagin();
    this.listBioData();
  }

  getCampagin() {
    this.common.commonService({}, "GET", "biodata/campaignStatus").subscribe(
      (data: any) => {
        this.campaignObj = data.campaign;
        this.isActiveCampaign = data.campaign.campaignStatus;
        this.campaignEndTime = this.campaignObj["endTime"];
        this.maleBioAmount = data.campaign.maleBioAmount;
        this.femaleBioAmount = data.campaign.femaleBioAmount;
        this.termsandconditions = data.campaign.termsandconditions;
        this.howitworks = data.campaign.howitworks;
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    );
  }

  listBioData() {
    this.common.commonService({}, "GET", "biodata/listBioData").subscribe(
      (data: any) => {
        this.allBiodata = data.allBios;
        this.listBioOptions = data.options;
        this.showListCount = data.options.showCount;
        this.bioCount = data.options.count;
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    );
  }

  onBiodataSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get("biodata").setValue(file);
    }
  }

  onPhoto1Select(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get("photo1").setValue(file);
    }
  }
  onPhoto2Select(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get("photo2").setValue(file);
    }
  }

  isValidForm(formData) {
    const errors = [];
    const mandatoryFields = [
      "name",
      "mobileNumber",
      "gender",
      "biodata",
      "photo1",
      "photo2",
      "",
    ];
    formData.forEach((value, key) => {
      if (!value) {
        if (key == "name") errors.push(`अपलोडकर्ता का नाम भरना अनिवार्य है! `);
        if (key == "mobileNumber")
          errors.push(`मोबाइल नंबर भरना अनिवार्य है! `);
        if (key == "gender") errors.push(`gender भरना अनिवार्य है! `);
        if (key == "biodata") errors.push(`बायोडाटा भरना अनिवार्य है! `);
        if (key == "photo1") errors.push(`पहला फोटो भरना अनिवार्य है! `);
        if (key == "photo2") errors.push(`दूसरा  फोटो भरना अनिवार्य है! `);
      }
    });
    return errors;
  }

  uploadBiodata() {
    const formData = new FormData();
    formData.append("biodata", this.uploadForm.get("biodata").value);
    formData.append("photo1", this.uploadForm.get("photo1").value);
    formData.append("photo2", this.uploadForm.get("photo2").value);
    formData.append("name", this.userData.name);
    formData.append("mobileNumber", this.userData.mobileNumber);
    formData.append("gender", this.userData.gender);
    this.errorMessage = "";
    this.successMessage = "";
    let errors = this.isValidForm(formData);
    if (errors.length) {
      this.errorMessage = errors.join(", ");
      return;
    }
    errors = [];
    this.common.uploadFileService(formData, "biodata/uploadBiodata").subscribe(
      (data: any) => {
        this.successMessage = data.message;
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    );
  }
}
