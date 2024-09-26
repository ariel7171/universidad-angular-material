import { Routes } from '@angular/router';  
import { AppComponent } from './app.component';

export const routes: Routes = [  
    {  
        path: '',  
        redirectTo: '/universidad',  
        pathMatch: 'full'  
    },  
    {  
        path: 'universidad',  
        component: AppComponent
    },  
    {  
        path: '**',  
        redirectTo: '/universidad'  
    }  
];  
