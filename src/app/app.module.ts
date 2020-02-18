import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { FCM } from "@ionic-native/fcm/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { ImagePageModule } from "src/app/modal/image/image.module";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    ImagePageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    FCM,
    Camera,
    File,
    FileTransfer,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
