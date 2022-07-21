import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'src/app/Infrastructure/country.interface';
import { Department } from 'src/app/Infrastructure/department.interface';
import { Gender } from 'src/app/Infrastructure/gender.interface';
import { student } from 'src/app/Infrastructure/student.interface';
import { StudentService } from 'src/app/studentservice/student.service';

@Component({
  selector: 'app-viewstudent',
  templateUrl: './viewstudent.component.html',
  styleUrls: ['./viewstudent.component.css'],
})
export class ViewstudentComponent implements OnInit {

  genderList: Gender[] = [];
  departmentList: Department[] = [];
  countryList: Country[] = [];
  stage: string | null | undefined;
  studentData: student = {
    studentId: 0,
    studentName: '',
    studentEmail: '',
    studentContact: '',
    date:'',
    genderId: 0,
    gender: {
      genderId: 0,
      genderName: ''
    },

    countryId: 0,
    country: {
    countryId: 0,
    countryName: ''
    },

    departmentId: 0,
    department : {
      departmentId: 0,
      departmentName: ''
    },

  };
  isNew = false;
  headerLabel = '';
  constructor(
    private studentservice: StudentService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Load list of gender through this line of code

    this.studentservice.getAllGender().subscribe((loadGender) => {
      debugger;
      this.genderList = loadGender;
    });

     //Load list of Department through this line of code
    this.studentservice.getAllDepartment().subscribe((loadDepartment) => {
      debugger;
      this.departmentList = loadDepartment;
    });

     //Load list of Counrty through this line of code
    this.studentservice.getAllCountry().subscribe((loadCountry) => {
      debugger;
      this.countryList = loadCountry;
    });

    this.route.paramMap.subscribe((params) => {
      this.stage = params.get('id');
    });
    if (this.stage) {
      if(this.stage){
        debugger
        if(this.stage.toLowerCase()=="Add".toLocaleLowerCase()){
          this.isNew = true;
          this.headerLabel = "Add Student"
        }
        else{
          this.isNew= false;
          this.headerLabel = "Update Student"

        }
      }
      this.studentservice.getStudent(this.stage).subscribe((data) => {
        this.studentData = data;
      });
    }
  }
  studentForm = this.fb.group({
    studentName: ['',Validators.required],
    studentEmail: ['',Validators.required],
    studentContact: ['',Validators.required],
    genderId: ['',Validators.required],
    departmentId: ['',Validators.required],
    countryId: ['',Validators.required],
    date: ['',Validators.required]
  })

  get date(){
    return this.studentForm.get('date');
  }
  get studentName(){
    return this.studentForm.get('studentName');
  }
  get studentEmail(){
    return this.studentForm.get('studentEmail');
  }
  get studentContact(){
    return this.studentForm.get('studentContact');
  }
  get departmentId(){
    return this.studentForm.get('departmentId');
  }
  get countryId(){
    return this.studentForm.get('countryId');
  }get genderId(){
    return this.studentForm.get('genderId');
  }


  UpdateStudent(): void {

    this.studentservice
      .updateStudent(this.studentData.studentId, this.studentData)
      .subscribe(
        (response) => {
          debugger
          let s = response;
          this.router.navigate(['/student'])
        }
      );
  }

  DeleteStudent():void{
    this.studentservice
    .deleteStudent(this.studentData.studentId)
    .subscribe(
      (response) => {
        let s = response;
        this.router.navigate(['/student'])
      }
    );
  }

  AddStudent():void{
    debugger
    if(this.studentForm.valid){
    this.studentservice
      .insertStudent(this.studentForm.value)
      .subscribe(
        (response) => {
          let s = response;
          this.router.navigate(['/student'])
        }
      );
  }
}
}
