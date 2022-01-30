import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AddEventComponent } from './add-event/add-event.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { EventViewComponent } from './event-view/event-view.component';
import { RemoveEventComponent } from './remove-event/remove-event.component';

import { LoggingInterceptor } from './interceptors/logging-interceptor';
import { SpinnerInterceptor } from './interceptors/spinner-interceptor';
import { HeartLoaderComponent } from './heart-loader/heart-loader.component';
import { JarImageComponent } from './jar-image/jar-image.component';
import { ButtonBarComponent } from './button-bar/button-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEventComponent,
    MenuBarComponent,
    EventViewComponent,
    RemoveEventComponent,
    HeartLoaderComponent,
    JarImageComponent,
    ButtonBarComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
