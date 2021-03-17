//================================
//***** MODULE LEVEL ROUTES *****
//================================
//LAZY LOADED ROUTES: feature modules
//Common route file to load all feature modules (Not their components)
//components of feature modules are loaded in the respective feature module routing file itself
//organized way of structuring
//all the routes for application are written in app-routing.module.ts

//Routes array
import {Routes} from '@angular/router';

export const contentRoute:Routes = [
    //Dashboard
    {path:'dashboard', loadChildren:()=>import('../../components/dashboard/dashboard.module').then(m=>m.DashboardModule)},

    //Masters
    {path:'masters',loadChildren:()=>import('../../components/masters/masters.module').then(m=>m.MastersModule)},

    //Products
    {path:'products',loadChildren:()=>import('../../components/products/products.module').then(m=>m.ProductsModule)},
    
    //Users
    {path:'users',loadChildren:()=>import('../../components/users/users.module').then(m=>m.UsersModule)},

    //Sales
    {path:'sales',loadChildren:()=>import('../../components/sales/sales.module').then(m=>m.SalesModule)},

    //Reports
    {path:'reports',loadChildren:()=>import('../../components/reports/reports.module').then(m=>m.ReportsModule)},

    //Invoice
    {path:'invoice',loadChildren:()=>import('../../components/invoice/invoice.module').then(m=>m.InvoiceModule)},

    //Settings
    {path:'settings',loadChildren:()=>import('../../components/settings/settings.module').then(m=>m.SettingsModule)},

    
    //** Auth - AUTH MODULE IS NOT a feature module
    //Auth module => shared module
    //{path:'auth',loadChildren:()=>import('../../components/auth/auth.module').then(m=>m.AuthModule)}
];
