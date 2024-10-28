import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { AppUtil } from 'src/app/common/app-util';
import { UserGroupService } from 'src/app/services/user-group.service';
import { selectUserGroupState } from 'src/app/store/app.state';
import {AccessTreeNode, Menu, MenuRights, UserGroup, UserGroupMenu} from 'src/app/store/model/usermanage.model';
import { TreeNode } from 'primeng/api';
import { UI_CONSTANT } from '../../../common/constants/ui-constants';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-mapaccessright',
  templateUrl: './mapaccessright.component.html',
  styleUrls: ['./mapaccessright.component.scss'],
})
export class MapaccessrightComponent implements OnInit {
  [x: string]: any;
  public usergroupName: string = '';
  public selectedMenuRights: AccessTreeNode[] = [];
  public selectedMenu: AccessTreeNode[] = [];
  menus: Array<{menuTypeID: number; menuTypeName: string; menuItems: AccessTreeNode[];}> = [];
  public userGroupMenu: UserGroupMenu = null;
  public menuItemsDataArray: string[] = [];
  public tabcontent: string;
  public tabIndex = 0;
  ModulePermissions: any;
  constructor(
    private _store: Store<any>,
    private userGroupService: UserGroupService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthService
  ) {}

  ChangeDetectionStrategy() {
    this.cdr.markForCheck();
  }
  ngOnInit(): void {
    this.authenticationService.setGlobalFilterVisibility(true);
    if (Number(this.activatedRoute.snapshot.params.id) > 0) {
      this._store.select(selectUserGroupState).subscribe((res) => {
        if (res && res.userGroupList) {
          const tempuserGroupList: UserGroup[] = AppUtil.deepCopy(res.userGroupList.userGroups);
          let userGroupInfo = tempuserGroupList.filter((i) => i.userGroupID === Number(this.activatedRoute.snapshot.params.id))[0];
          this.userGroupName = userGroupInfo.userGroupName;
          this.prepareMenuAccess(userGroupInfo.userGroupID);
          this.cdr.markForCheck();
        }
      });
    }
  }

  prepareMenuAccess(userGroupID) {
    if (userGroupID && userGroupID > 0) {
      this.userGroupService.fetchMenuAccessRight(userGroupID).subscribe((res) => {
          if (res && res.userGroup) {
            //console.log("service response: ")
            //console.log(res.userGroup)
            this.userGroupMenu = AppUtil.deepCopy(res.userGroup);
            this.userGroupMenu.menuTypes.forEach((tab) => {
              const menuItemsArr = this.generateMenuItems(tab.menues);
              //console.log(menuItemsArr)
              this.menus.push({menuTypeID: tab.menuTypeID, menuTypeName: tab.menuTypeName, menuItems: menuItemsArr });
            });
            this.prepareDataArrayForCurrentTab(this.tabIndex);
          }
        });
    }
  }

  generateMenuItems(arr: Menu[]): Array<AccessTreeNode> {
    const menuItems: Array<AccessTreeNode> = [];
    const childrenArr = arr.filter((i) => i.parentKey > 0);
    const parentArr = arr.filter((i) => i.parentKey === 0);
    parentArr.forEach((val) => {
      const pData = {
        label: val.menuName,
        data: val.menuID,
        expandedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_OPEN,
        collapsedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_CLOSE,
        key: String(val.menuID),
        children: this.getChildNode(childrenArr, val.menuID),
        selected: val.selected,
      };
      menuItems.push(pData);
    });
    return menuItems;
  }

  getChildNode(childMenuArr: Array<Menu>, parentkey: number): Array<AccessTreeNode> {
    const childTreeNode: Array<AccessTreeNode> = [];
    const parentVal: AccessTreeNode = {} as AccessTreeNode;
    childMenuArr.forEach((menu) => {
      if (parentkey === menu.parentKey) {
        const parentV: AccessTreeNode = {
          label: menu.menuName,
          data: menu.menuID,
          expandedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_OPEN,
          collapsedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_CLOSE,
          leaf: false,
          selected: menu.selected,
        };
        if (menu.menuRights.length > 0) {
          let menuRights = this.getMenuRights(menu.menuRights, parentV);
          childTreeNode.push({
            label: menu.menuName,
            data: menu.menuID,
            expandedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_OPEN,
            collapsedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_CLOSE,
            children: menuRights,
            leaf: menuRights.length > 0 ? false : true,
            selected: menu.selected,
          });
        } else {
          let childSubMenu = this.getChildNode(childMenuArr, menu.menuID);
          if (childSubMenu.length > 0) {
            childTreeNode.push({
              label: menu.menuName,
              data: menu.menuID,
              expandedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_OPEN,
              collapsedIcon: UI_CONSTANT.APP_TREE_ICON.FOLDER_CLOSE,
              children: childSubMenu,
              leaf: childSubMenu.length > 0 ? false : true,
              selected: menu.selected,
            });
          } else {
            childTreeNode.push({
              label: menu.menuName,
              data: menu.menuName + '#' + menu.menuID + '#' + 'noaction',
              expandedIcon: null,
              collapsedIcon: null,
              leaf: true,
              children: [],
              selected: menu.selected,
            });
          }
        }
      }
    });
    return childTreeNode;
  }
  getMenuRights(menuRights: Array<MenuRights>, parentV: AccessTreeNode) {
    const rightsArr: AccessTreeNode[] = [];
    if (menuRights) {
      menuRights.forEach((accessRight) => {
        rightsArr.push({
          label: accessRight.displayName,
          data: parentV.label + '#' + accessRight.menuID + '#' + accessRight.displayName,
          expandedIcon: this.getIcon(accessRight.displayName),
          collapsedIcon: this.getIcon(accessRight.displayName),
          leaf: true,
          selected: accessRight.selected,
        });
      });
    }
    return rightsArr;
  }

  getIcon(val) {
    if (val === 'Add') {
      return UI_CONSTANT.APP_TREE_ICON.ADD;
    } else if (val === 'Update') {
      return UI_CONSTANT.APP_TREE_ICON.UPDATE;
    } else {
      return UI_CONSTANT.APP_TREE_ICON.DELETE;
    }
  }

  prepareDataArrayForCurrentTab(index) {
    const menuItems = this.menus[index].menuItems;
    menuItems.forEach((menu) => {
      this.getMenuItemsDataArray(menu.children);
    });
    this.checkSelectedMenus(menuItems, this.menuItemsDataArray);
    //console.log(menuItems)
    //console.log(this.menuItemsDataArray)
  }

  getMenuItemsDataArray(childArray: AccessTreeNode[]) {
    childArray.forEach((menu) => {
      if (menu.children && menu.children.length > 0) {
        return this.getMenuItemsDataArray(menu.children);
      } else {
        if (menu.selected) {
          this.menuItemsDataArray.push(menu.data);
        }
      }
    });
  }

  checkSelectedMenus(nodes: AccessTreeNode[], menuItemsDataArr: string[]) {
    for (let i = 0; i < nodes?.length; i++) {
      if (!nodes[i].leaf && nodes[i]?.children?.length > 0 && nodes[i]?.selected) {
        for (let j = 0; j < nodes[i].children.length; j++) {
          if (menuItemsDataArr.includes(nodes[i]?.children[j].data) && nodes[i]?.children[j].selected) {
            if (!this.selectedMenuRights.includes(nodes[i]?.children[j])) {
              this.selectedMenuRights.push(nodes[i].children[j]);
            }
          }
        }
      }

      if (nodes[i].selected && nodes[i].leaf) {
        this.selectedMenuRights.push(nodes[i]);
        //return;
      }

      this.checkSelectedMenus(nodes[i]?.children, menuItemsDataArr);
      let totalSelectedChildNodes = 0;
      for (let j = 0; j < nodes[i]?.children?.length; j++) {
        if (this.selectedMenuRights.includes(nodes[i].children[j])) {
          totalSelectedChildNodes++;
        }
        if (nodes[i].children[j].partialSelected)
          nodes[i].partialSelected = true;
      }
      if(totalSelectedChildNodes==0){}
      else if (totalSelectedChildNodes == nodes[i]?.children?.length) {
        nodes[i].partialSelected = false;
        if (!this.selectedMenuRights.includes(nodes[i])) {
          this.selectedMenuRights.push(nodes[i]);
        }
      } else {
        nodes[i].partialSelected = true;
      }
    }
  }
  
  nodeSelect(event, selectedMenuRights) {
    this.ModulePermissions = selectedMenuRights;
  }
  nodeUnselectData(event, selectedMenuRights) {
    //console.log(selectedMenuRights);
    this.unselectChildNodes(event.node);
  }

  unselectChildNodes(node: AccessTreeNode) {
    if (node.leaf) {
     this.menuItemsDataArray= this.menuItemsDataArray.filter((mn)=>mn != node.data);//.splice(this.menuItemsDataArray.indexOf(node.data), 1);
     this.selectedMenuRights= this.selectedMenuRights.filter((mn)=>mn.data != node.data);//.splice(this.selectedMenuRights.indexOf(node.data), 1);
     this.ModulePermissions = this.selectedMenuRights.filter((mn)=>mn.data != node.data) ;
     return;
    }
    if (node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        this.unselectChildNodes(node.children[i]);
      }
    }
  }

  addNode(node: AccessTreeNode) {
    if (node.leaf) {
      if (!this.menuItemsDataArray.includes(node.data)) {
        this.menuItemsDataArray.push(node.data);
      }
      return;
    }
    if (node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        this.addNode(node.children[i]);
      }
    }
  }

  SaveUserGroupMappingData() {
    this.userGroupMenu.menuTypes.forEach((tabMenu) => {
      if (tabMenu.menues.length > 0) {
        tabMenu.menues.map((menu) => {
          if (menu.menuRights.length > 0) {
            menu.menuRights.forEach((menuRights) => {
              const datVal = menu.menuName + '#' + menu.menuID + '#' + menuRights.displayName;
              const selectedMenu = this.ModulePermissions.filter((right) => right.data === datVal);
              menu.selected = menu.selected || (selectedMenu && selectedMenu.length > 0);
              menuRights.selected = selectedMenu && selectedMenu.length > 0;
            });
          } else {
            const datVal = menu.menuName + '#' + menu.menuID + '#' + 'noaction';
            const selectedMenu = this.ModulePermissions.filter((right) => right.data === datVal);
            menu.selected = selectedMenu && selectedMenu.length > 0;
          }
        });
      }
    });
    console.log("request to server")
    console.log(this.userGroupMenu);
    this.userGroupService.updateStateOfMappingAccess(this.userGroupMenu);
    this.CancelUserGroupMappingData();
  }
  CancelUserGroupMappingData() {
    this.router.navigate(['/usermanage/user-group']);
  }
  keyPressNumbers(event) {
    AppUtil.validateNumbers(event);
  }
  keyPressAlphanumeric(event) {
    AppUtil.validateAlphanumeric(event);
  }

  handleChange(event) {
    this.prepareDataArrayForCurrentTab(event.index);
  }
}
