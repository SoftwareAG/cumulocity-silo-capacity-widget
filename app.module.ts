import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as NgRouterModule } from '@angular/router';
import { UpgradeModule as NgUpgradeModule } from '@angular/upgrade/static';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import {
  DashboardUpgradeModule,
  UpgradeModule,
  HybridAppModule,
  UPGRADE_ROUTES
} from '@c8y/ngx-components/upgrade';
import { AssetsNavigatorModule } from '@c8y/ngx-components/assets-navigator';
import { CockpitDashboardModule } from '@c8y/ngx-components/context-dashboard';
import { ReportsModule } from '@c8y/ngx-components/reports';
import { SensorPhoneModule } from '@c8y/ngx-components/sensor-phone';
import { ColorPickerComponent } from "./src/silo-capacity-widget/color-picker/color-picker-component";
import { ColorSliderComponent } from "./src/silo-capacity-widget/color-picker/color-slider/color-slider-component";
import { ColorPaletteComponent } from "./src/silo-capacity-widget/color-picker/color-palette/color-palette-component";
import { SiloCapacityWidget } from "./src/silo-capacity-widget/silo-capacity-widget.component";
import { SiloCapacityWidgetConfig } from "./src/silo-capacity-widget/silo-capacity-widget-config.component";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgRouterModule.forRoot([...UPGRADE_ROUTES], { enableTracing: false, useHash: true }),
    CoreModule.forRoot(),
    AssetsNavigatorModule,
    ReportsModule,
    NgUpgradeModule,
    DashboardUpgradeModule,
    CockpitDashboardModule,
    SensorPhoneModule,
    UpgradeModule
  ],
  declarations: [SiloCapacityWidget, SiloCapacityWidgetConfig, ColorPickerComponent, ColorSliderComponent, ColorPaletteComponent],
  entryComponents: [SiloCapacityWidget, SiloCapacityWidgetConfig],
  providers: [{
    provide: HOOK_COMPONENTS,
    multi: true,
    useValue: [
      {
        id: 'global.presales.silo.capacity.widget',
        label: 'Silo Capacity',
        description: 'Displays silo capacity fill levels, foreground image, background image and thresholds',
        component: SiloCapacityWidget,
        configComponent: SiloCapacityWidgetConfig,
        previewImage: require("./styles/previewImage.png")
      }
    ]
  }],
})
export class AppModule extends HybridAppModule {
  constructor(protected upgrade: NgUpgradeModule) {
    super();
  }
}
