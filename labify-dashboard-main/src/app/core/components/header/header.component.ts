import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { StorageService } from '../../../core/services/storage.service';
import {
  AuthService,
  USER_KEY,
  USER_ROLE,
} from '../../../core/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationData } from '../../models/notification.model';
import { FirebaseCloudMessagingService } from '../../services/firebase-cloud-messaging.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.collapseSidebar();
  }

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  windowWidth = window.innerWidth;
  sidebarState: 'collapsed' | 'compacted' | 'expanded' = 'expanded';

  companies!: any;
  selectedCompanyId!: number;
  role!: any;
  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];
  notificationsActive = false;

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private nbMenuService: NbMenuService,
    private authService: AuthService,
    private router: Router,
    private companyService: CompanyService,
    private storageService: StorageService,
    private notificationsService: NotificationService,
    private fcmService: FirebaseCloudMessagingService
  ) {}

  notifications: NotificationData[] = [];
  placeholders!: Array<any>;
  pageSize = 10;
  pageToLoadNext = 1;
  loading = false;

  ngOnInit() {
    this.fcmService.listenToMessages();
    this.listenToNotifications();

    this.loadNext();
    this.user = this.storageService.getLocalStorageValue(USER_KEY);
    this.role = this.storageService.getLocalStorageValue(USER_ROLE);

    this.currentTheme = this.themeService.currentTheme;
    // console.log(this.role);
    // this.getCompanies();

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe((title) => {
        if (title === 'Log out') {
          this.logout();
        }
      });
  }

  ngAfterViewInit() {
    this.collapseSidebar();
    this.listenToNavClickes();
  }

  listenToNotifications() {
    this.notificationsService.newNotification$.subscribe((val) => {
      if (val.id) {
        this.notifications.unshift(val);
        this.notificationsActive = true;
      }
    });
  }

  loadNext() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.placeholders = new Array(this.pageSize);
    this.notificationsService
      .getAllNotifications(this.pageToLoadNext)
      .subscribe((notifications) => {
        this.placeholders = [];
        this.notifications.push(...notifications);
      console.log(this.notifications);

        this.loading = false;
        this.pageToLoadNext++;
      });
  }

  // getCompanies() {
  //   if (this.role === 'company') {
  //     this.selectedCompanyId = this.user.id;
  //     // this.companyService.setSelectedCompany(this.user.id);
  //     this.companies = [
  //       {
  //         name: this.user.name,
  //         id: this.user.id,
  //       },
  //     ];
  //     // console.log(this.companies);
  //   } else {
  //     this.companyService.getData().subscribe((res) => {
  //       // console.log(res);
  //       this.companies = res.data;
  //       // let selectedCompanyId = this.companyService.getSelectedCompany().value;
  //       // if (selectedCompanyId) {
  //       //   this.selectedCompanyId = selectedCompanyId;
  //       // } else {
  //       //   this.selectedCompanyId = this.companies[0].id;
  //       //   this.companyService.setSelectedCompany(this.companies[0].id);
  //       // }
  //     });
  //   }
  // }

  // onCompanySelect(id: number) {
  // this.companyService.setSelectedCompany(id);
  // }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.clear();
        location.reload();
        this.router.navigate(['auth/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['auth/login']);
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar() {
    this.windowWidth = window.innerWidth;
    if (
      this.sidebarState === 'collapsed' ||
      this.sidebarState === 'compacted'
    ) {
      this.sidebarService.expand();
      this.sidebarState = 'expanded';
    } else if (this.windowWidth <= 768) {
      this.sidebarService.collapse();
      this.sidebarState = 'collapsed';
    } else {
      this.sidebarService.compact();
      this.sidebarState = 'compacted';
    }

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  collapseSidebar() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth <= 768) {
      this.sidebarService.collapse();
      this.sidebarState = 'collapsed';
    } else {
      this.sidebarService.expand();
      this.sidebarState = 'expanded';
    }
  }

  listenToNavClickes() {
    const navMenu = document.querySelector('.menu-items');
    const navLinks: any = navMenu?.getElementsByTagName('A');
    let links: any = [];

    for (let link of navLinks) {
      if (link.href.includes('#')) continue;
      else links.push(link);
    }

    for (let link of links) {
      link.addEventListener('click', () => {
        this.windowWidth = window.innerWidth;
        if (this.windowWidth <= 768) {
          this.sidebarService.collapse();
          this.sidebarState = 'collapsed';
        }
      });
    }
  }
}
