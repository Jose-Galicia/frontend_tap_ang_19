// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';
import { UserViewComponent } from './user-view/user-view.component';
import {UserFormComponent} from './user-form/user-form.component';
import { NotFoundComponent } from './not-found-component/not-found-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductViewComponent } from './product-view/product-view.component';
import {PerfilesComponent} from './perfiles/perfiles.component';
import {PerfilViewComponent} from './perfil-view/perfil-view.component';
import {PerfilFormComponent} from './perfil-form/perfil-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // Dashboard es ahora la vista de inicio logueada
  { path: 'inicio', component: DashboardComponent, canActivate: [authGuard] },
  // Las rutas protegidas por el guard
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
    // Rutas para la gestión de productos
    { path: 'products/ver/:id', component: ProductViewComponent, canActivate: [authGuard] },
    { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard] },
    { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [authGuard] },

  //Rutas para los usuarios
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    { path: 'users/ver/:id', component: UserViewComponent, canActivate: [authGuard] },
    { path: 'users/new', component: UserFormComponent, canActivate: [authGuard] },
    { path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard] },

  //Rutas para los perfiles
  { path: 'profiles', component: PerfilesComponent, canActivate: [authGuard] },
    { path: 'profiles/ver/:id', component: PerfilViewComponent, canActivate: [authGuard] },
    { path: 'profiles/new', component: PerfilFormComponent, canActivate: [authGuard] },
    { path: 'profiles/edit/:id', component: PerfilFormComponent, canActivate: [authGuard] },

  // La ruta de tu página de error
  { path: 'not-found', component: NotFoundComponent },
  // Redirección por defecto: si la URL es la raíz '', redirige a login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // La ruta comodín para cualquier URL que no coincida
  // Esta debe ir al final.
  { path: '**', redirectTo: '/not-found' }
];