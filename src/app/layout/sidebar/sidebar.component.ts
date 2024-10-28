import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UI_CONSTANT } from 'src/app/common/constants/ui-constants';
import { UserGroupService } from 'src/app/services/user-group.service';
import { currentUserMenuItems, selectUserMenuItems } from 'src/app/store/app.state';
import { Menu, UserGroup, UserGroupMenuType } from 'src/app/store/model/usermanage.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public navbarCollapsed = true;
  public menuItems: Array<Menu>= [];
  public usergroupMenu: Array<UserGroupMenuType> =[];
  constructor(private _store: Store<UserGroup>, private usergroupService: UserGroupService,
    public route: Router) {
  // this.usergroupService.fetchMenuItems();
   }

  ngOnInit(): void {
    this._store.select(selectUserMenuItems).subscribe(response=>{
      if (response && response.menuItemsList) {
          this.usergroupService.updateCurrentMenu(response.menuItemsList[1]);
          this.usergroupMenu = response.menuItemsList;
          let newVisitor = this.usergroupService.isMenuAccessable(UI_CONSTANT.MenuAccessLable.Leave_Master, UI_CONSTANT.ACTIONS.ADD);
        if(newVisitor == true){
        }else{

        }
      }
    });

    this._store.select(currentUserMenuItems).subscribe(response=>{
      this.menuItems =response?.currentMenuItemsList.menuItems;
    });
    console.log('menu',this.menuItems);
  }
  public loadDefaultMenu(){
    this.usergroupService.updateCurrentMenu(this.usergroupMenu[1]);
  }
  isRequestMenu(menuName){
    return menuName.toLowerCase() === 'request';
  }

}