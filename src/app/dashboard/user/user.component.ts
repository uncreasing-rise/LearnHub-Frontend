import { Component, ElementRef, Renderer2 } from '@angular/core';
import { UserService } from '../../api/services/user/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  userList: any;
  isConfirmDeletePopup: boolean = false;
  isDetailPopup: boolean = false;
  isShowPopupEdit: boolean = false;
  userSelected: any;
  selectedRole: any = '';

  fullname: any;
  age: any;
  phone: any;
  email: any;
  image: any;
  frame: any;
  facebook: any;
  role: any;
  roleSelected: any;
  tablinks: any;
  tabcontents: any;
  listUserDeleted: any;
  isShowRestoreConfirm: any;
  activeTab: any = 'tab1';
  constructor(private userService: UserService, private renderer: Renderer2, private el: ElementRef) { }
  ngOnInit() {

    this.getListUser()
    this.getListUserDeleted()
  }



  handleUpdateInfo(key: any, e: any) {
    if (key == 'fullname') {
      this.userSelected.fullname = e.target.value;
    } else if (key == 'age') {
      this.userSelected.age = e.target.value;
    } else if (key == 'phone') {
      this.userSelected.phone = e.target.value;
    } else if (key == 'imageCdn') {
      this.userSelected.image = e.target.value;

      this.userSelected.frame = document.getElementById('frame');
      this.userSelected.frame.src = URL.createObjectURL(e.target.value);
    }
    else if (key == 'imageFile') {
      this.userSelected.image = e.target.value;

      this.userSelected.frame = document.getElementById('frame');
      this.userSelected.frame.src = URL.createObjectURL(e?.target?.files[0]);
    }
    else if (key == 'email') {
      this.userSelected.email = e.target.value;
    } else if (key == 'role') {
      if (e == 'ADMIN') {
        this.roleSelected = 1;
      } else if (e == 'COURSEMANAGER') {
        this.roleSelected = 2;

      } else if (e == 'STUDENT') {
        this.roleSelected = 3;
      }

      this.userSelected.role = e;
    }
  }

  ngOnDestroy() {
    this.selectedRole = ''
  }

  onRoleSelected(key: string) {
    this.selectedRole = key;
    this.handleUpdateInfo('role', key)
  }

  getListUserDeleted() {
    this.userService.getAllUserDeleted().subscribe(
      (response) => {
        this.listUserDeleted = response.payload;

      },
      (error) => {
        // Handle login error
        alert('get list user failed');
        console.error('get list user failed', error);
      }
    );
  }

  getListUser() {
    this.userService.getAllUser().subscribe(
      (response) => {
        this.userList = response.payload;

      },
      (error) => {
        // Handle login error
        alert('get list user failed');
        console.error('get list user failed', error);
      }
    );
  }

  confirmDelete(user: any) {
    this.isConfirmDeletePopup = true;
    this.userSelected = user
  }

  onSubmitDeleteUser() {
    this.userService.deleteUser(this.userSelected.id).subscribe(
      (response) => {
        alert('delete user success');
        window.location.reload()
      },
      (error) => {
        // Handle login error
        alert('delete user failed');
        console.error('delete user failed', error);
      }
    );
  }

  onSubmitRestoreUser() {
    this.userService.restoreUser(this.userSelected.id).subscribe(
      (response) => {
        alert('delete user success');
        window.location.reload()
      },
      (error) => {
        // Handle login error
        alert('restore user failed');
        console.error('restore user failed', error);
      }
    ); 
  }

  showRestoreConfirm(user: any) {
    this.userSelected = user
    this.isShowRestoreConfirm = true
  }

  onClosePopupRestore() {
    this.isShowRestoreConfirm = false
  }

  onClosePopupDelete() {
    this.isConfirmDeletePopup = false
    this.userSelected = null
  }

  showDetailUser(user: any) {
    this.isDetailPopup = true
    this.getUserInfo(user)
  }

  getUserInfo(user: any) {
    this.userService.getDetailUser(user.id).subscribe(
      (response) => {
        this.userSelected = response.payload
      },
      (error) => {
        // Handle login error
        alert('get detail user failed');
      }
    );
  }

  showPopupEdit(user: any) {
    this.getUserInfo(user)

    this.isShowPopupEdit = true;
  }

  onClosePopupEdit() {
    this.isShowPopupEdit = false;
  }

  onSubmitUpdateUser() {
    this.userService.UpdatelUser(this.userSelected.id,
      this.userSelected.fullname,
      this.userSelected.email,
      this.userSelected.image, this.roleSelected).subscribe(
        (response) => {
          this.isShowPopupEdit = false;
          this.userSelected = null
          this.getListUser()
        },
        (error) => {
          // Handle login error
          alert('get info failed');
          console.error('get info failed', error);
        }
      );
  }

  openTab(tabName: string) {
    this.activeTab = tabName
    const tablinks = this.el.nativeElement.querySelectorAll('.tab-links');
    const tabcontents = this.el.nativeElement.querySelectorAll('.tab-contents');

    tablinks.forEach((tablink: HTMLElement) => {
      this.renderer.removeClass(tablink, 'active-link');
    });

    tabcontents.forEach((tabcontent: HTMLElement) => {
      this.renderer.removeClass(tabcontent, 'active-tab');
    });

    const clickedTabLink = this.el.nativeElement.querySelector(`.tab-links[data-tab="${tabName}"]`);
    const targetTabContent = this.el.nativeElement.querySelector(`.tab-contents#${tabName}`);

    if (clickedTabLink) {
      this.renderer.addClass(clickedTabLink, 'active-link');
    }

    if (targetTabContent) {
      this.renderer.addClass(targetTabContent, 'active-tab');
    }
  }

  onClosePopupDetail() {
    this.isDetailPopup = false
    this.userSelected = null
  }
}
