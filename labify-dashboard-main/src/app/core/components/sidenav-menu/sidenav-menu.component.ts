import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { StorageService } from '../../services/storage.service';
import { USER_KEY, USER_ROLE } from '../../services/auth.service';

// ✋🏼✋🏼❌❌ Don't touch titles (It's used in permissions)
export const ADMIN_PAGES: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/home',
    ariaRole: 'link',
  },
  {
    title: 'Place On-Demand Order',
    icon: 'archive-outline',
    link: '/place-on-demand-order',
  },
  {
    title: 'Track Orders',
    icon: 'checkmark-circle-outline',
    link: '/track-orders',
  },
  {
    title: 'Track Schedule Orders',
    icon: 'checkmark-square-outline',
    link: '/schedule-orders',
  },
  {
    title: 'Assign Drivers',
    icon: 'done-all-outline',
    link: '/basic-order-updates/assign-drivers',
  },
  {
    title: 'Basic Maintenance',
    icon: 'person-done-outline',
    children: [
      {
        title: 'Customers',
        link: '/basic-maintenance/customers',
      },
      {
        title: 'Address Points',
        link: '/basic-maintenance/address-points/addresses',
      },
      {
        title: 'Account Managers',
        link: '/basic-maintenance/account-managers',
      },
      {
        title: 'Drivers',
        link: '/basic-maintenance/drivers',
      },
    ],
  },
  {
    title: 'Dispatch',
    icon: 'map-outline',
    target: '_blank',
    url: '/dispatch/track-drivers',
  },
  {
    title: 'System Setup',
    icon: 'settings-2-outline',
    children: [
      {
        title: 'Web',
        children: [
          {
            title: 'Roles',
            link: '/system-setup/roles',
          },
          {
            title: 'Users',
            link: '/system-setup/users',
          },
        ],
      },
      {
        title: 'Default Prices',
        link: '/system-setup/default-prices',
      },
    ],
  },
  {
    title: 'Invoices',
    icon: 'hard-drive-outline',
          children: [
            {
              title: 'Company',
              link: 'invoices/company',
            },
            {
              title: 'Driver',
              link: 'invoices/driver',
            },
          ],
  },
];
// ✋🏼✋🏼❌❌ Don't touch titles (It's used in permissions)
export const ACCOUNT_MANAGER_PAGES: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/home',
    ariaRole: 'link',
  },
  {
    title: 'Place On-Demand Order',
    icon: 'archive-outline',
    link: '/place-on-demand-order',
  },
  {
    title: 'Track Orders',
    icon: 'checkmark-circle-outline',
    link: '/track-orders',
  },
  {
    title: 'Track Schedule Orders',
    icon: 'checkmark-square-outline',
    link: '/schedule-orders',
  },
  {
    title: 'Assign Drivers',
    icon: 'done-all-outline',
    link: '/basic-order-updates/assign-drivers',
  },
  {
    title: 'Basic Maintenance',
    icon: 'person-done-outline',
    children: [
      {
        title: 'Customers',
        link: '/basic-maintenance/customers',
      },
      {
        title: 'Address Points',
        link: '/basic-maintenance/address-points/addresses',
      },
      {
        title: 'Drivers',
        link: '/basic-maintenance/drivers',
      },
    ],
  },
  {
    title: 'Dispatch',
    icon: 'map-outline',
    target: '_blank',
    url: '/dispatch/track-drivers',
  },
  {
    title: 'System Setup',
    icon: 'settings-2-outline',
    children: [
      // {
      //   title: 'Web',
      //   children: [
      //     {
      //       title: 'Roles',
      //       link: '/system-setup/roles',
      //     },
      //     {
      //       title: 'Users',
      //       link: '/system-setup/users',
      //     },
      //   ],
      // },
      {
        title: 'Default Prices',
        link: '/system-setup/default-prices',
      },
    ],
  },
  {
    title: 'Invoices',
    icon: 'hard-drive-outline',
          children: [
            {
              title: 'Company',
              link: 'invoices/company',
            },
            {
              title: 'Driver',
              link: 'invoices/driver',
            },
          ],
  },
];
// ✋🏼✋🏼❌❌ Don't touch titles (It's used in permissions)
const COMPANY_PAGES: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/home',
  },
  {
    title: 'Place On-Demand Order',
    icon: 'archive-outline',
    link: '/place-on-demand-order',
  },
  {
    title: 'Track Orders',
    icon: 'checkmark-circle-outline',
    link: '/track-orders',
  },
  {
    title: 'Track Schedule Orders',
    icon: 'checkmark-square-outline',
    link: '/schedule-orders',
  },
  {
    title: 'Basic Maintenance',
    icon: 'person-done-outline',
    children: [
      {
        title: 'Address Points',
        link: '/basic-maintenance/address-points/addresses',
      },
    ],
  },
  {
    title: 'Dispatch',
    icon: 'map-outline',
    target: '_blank',
    url: '/dispatch/track-drivers',
  },
  {
    title: 'System Setup',
    icon: 'settings-2-outline',
    children: [
      {
        title: 'Web',
        children: [
          {
            title: 'Roles',
            link: '/system-setup/roles',
          },
          {
            title: 'Users',
            link: '/system-setup/users',
          },
        ],
      },
    ],
  },
  // {
  //   title: 'Invoices',
  //   icon: 'hard-drive-outline',
  //         children: [
  //           {
  //             title: 'Company',
  //             link: 'invoices/company',
  //           },
  //           {
  //             title: 'Driver',
  //             link: 'invoices/driver',
  //           },
  //         ],
  // },
];

@Component({
  selector: 'app-sidenav-menu',
  template: `<nb-menu [items]="menu" autoCollapse="true"> </nb-menu>`,
  styles: [],
})
export class SidenavMenuComponent {
  menu!: NbMenuItem[];
  userRole: string;
  userPermissions: string[] = [];

  constructor(private storageService: StorageService) {
    this.userRole = this.storageService.getLocalStorageValue(USER_ROLE);
    this.userPermissions =
      this.storageService.getLocalStorageValue(USER_KEY)?.permissions;
    this.menu = this.getFilteredMenu();
  }

  private getFilteredMenu(): NbMenuItem[] {
    if (this.userRole === 'admin' )
      return ADMIN_PAGES;
    else if (this.userRole === 'account_manager') return ACCOUNT_MANAGER_PAGES;
    else if (this.userRole === 'company') return COMPANY_PAGES;
    else {
      let filteredPages: NbMenuItem[] = [];

      const tranverse = (pages: NbMenuItem[]) => {
        for (let page of pages) {
          if (this.userPermissions.includes(page.title))
            filteredPages.push(page);

          if (page.children) tranverse(page.children);
        }
      };

      tranverse(ADMIN_PAGES);

      return filteredPages;
    }
  }
}
