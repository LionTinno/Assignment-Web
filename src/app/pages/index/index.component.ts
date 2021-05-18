import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {

  private baseUrl = 'https://localhost:5001/FileMananger/';
  public data: any = [];
  fileupload: any;

  public Currency: string = "";
  public StartDate: string = new Date().toISOString().split('T')[0];
  public EndDate: string = new Date().toISOString().split('T')[0];
  public Status: string = "All";
  
  public option: string = "";

  public swithtable: boolean = false;
  public errordata: any= [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  getTransaction(){
    this.data = [];

    let apiurl = "";

    this.swithtable =false;

    switch (this.option) {
      case "1":
        apiurl = this.baseUrl + 'transactionbycurrency?currency='+ this.Currency;
      break;
      case "2":
        let startdate =this.StartDate.split('-');
        let enddate =this.EndDate.split('-');

        apiurl = this.baseUrl + 'transactionbydate?startdate='+ startdate[0] +startdate[1] +startdate[2] + '&enddate=' + enddate[0] +enddate[1] +enddate[2];
        console.log(this.StartDate);
      break;
      case "3":
        apiurl = this.baseUrl + 'transactionbystatus?status='+ this.Status;
      break;
      default: apiurl = this.baseUrl + 'all';
    }

    this.http.get(apiurl).subscribe(
      (response :any) => {

        let transactions = response.data;

        for (let index = 0; index < transactions.length; index++) {
          
          const element = transactions[index];

          this.data.push(element);
        }
      },
      (error) => console.log(error)
    )
  }

  fileChange(event: any) {
    let fileList: FileList = event.target.files;

    if(fileList.length > 0) {
        if (fileList[0].size > 1024) {
          event.target.value = "";
          return alert('File size is more than 1 MB! ')
        }
          
        this.fileupload = fileList[0];
    }
  }

  uploadFile() {
        let formData:FormData = new FormData();
        formData.append('file', this.fileupload, this.fileupload.name);
        
        this.http.post(this.baseUrl + 'UploadFile', formData).subscribe(
                      (response: any) => {
                        this.swithtable = false;
                        let message = response.message;
                        alert(message)
                      },
                      (error) => {
                        this.swithtable = true;
                        this.errordata = error.error;
                        alert('Upload Fail');
                    }
        )
  }

  checkOption1() {
    this.option = "1"
  }
  checkOption2() {
    this.option = "2"
  }
  checkOption3() {
    this.option = "3"
  }
}
