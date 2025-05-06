import {Routes} from '@angular/router';
import {MainPage} from "./modules/cabinet/pages/main.page";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cabinet',
        pathMatch: "full"
    },
    {
        path: 'cabinet',
        loadComponent: () => import('./modules/cabinet/pages/main.page').then((c: any) => c.MainPage)
    }
];
