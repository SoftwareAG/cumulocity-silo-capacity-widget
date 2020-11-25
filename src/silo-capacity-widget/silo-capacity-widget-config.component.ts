/*
* Copyright (c) 2019 Software AG, Darmstadt, Germany and/or its licensors
*
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */
import { Component, Input, OnInit } from '@angular/core';
import { WidgetConfig } from './i-widget-config';
import * as _ from 'lodash'
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
    selector: 'silo-capacity-widget-config',
    template: `
        <div class="form-group">


            <!-- Measurement configuration -->

            <div class="row">
                <div class="configuration-panel">
                    <div class="row">
                        <div class="col-lg-12 configuration-panel-title">
                            Measurement configuration
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <c8y-form-group>
                                <label for="measurementSeries">
                                    Measurement
                                </label>
                                <select class="form-control" id="measurementSeries" name="measurementSeries"
                                        [(ngModel)]="config.measurementSeries" (click)="loadFragmentSeries()">
                                    <option [ngValue]="seriesValue" *ngFor="let seriesValue of supportedSeries"
                                            [selected]="seriesValue == config.measurementSeries">{{seriesValue}}</option>
                                    required
                                </select>
                            </c8y-form-group>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="fillLevelMaximumLabel">Maximum fill level label</label>
                                <input type="text" class="form-control" id="fillLevelMaximumLabel"
                                       name="fillLevelMaximumLabel"
                                       placeholder="Set the label which will be displayed for the maximum fill level"
                                       [(ngModel)]="config.fillLevelMaximumLabel" required>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="fillLevelMaximumAmount">Maximum fill amount</label>
                                <input type="number" class="form-control" id="fillLevelMaximumAmount"
                                       name="fillLevelMaximumAmount"
                                       placeholder="Set the maximum fill level"
                                       [(ngModel)]="config.fillLevelMaximumAmount" required>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="fillLevelUnit">Fill Level unit</label>
                                <input type="text" class="form-control" id="fillLevelUnit" name="fillLevelUnit"
                                       placeholder="Set the fill level unit e.g. litres"
                                       [(ngModel)]="config.fillLevelUnit" required>
                            </c8y-form-group>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="fillOrRemainingLabel">Fill or remaining label</label>
                                <input type="text" class="form-control" id="fillOrRemainingLabel"
                                       name="fillOrRemainingLabel"
                                       placeholder="Set the label which will be displayed for the fill or remaining level"
                                       [(ngModel)]="config.fillOrRemainingLabel" required>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-8">
                            <div class="row">
                                <div class="col-lg-12">
                                    <label for="fillOrRemainingCalculation">Fill or remaining calculation</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-5">
                                    <span class="calculate-remaining-volume-container">
                                        <input type="radio" id="calculateRemainingVolume" name="fillOrRemainingCalculation"
                                               value="calculateRemainingVolume"
                                               [(ngModel)]="config.fillOrRemainingCalculation"/>
                                        <label for="calculateRemainingVolume">Calculate remaining volume</label>
                                    </span>
                                </div>
                                <div class="col-lg-4">
                                    <span class="calculate-fill-volume-container">
                                        <input type="radio" id="calculateFillVolume" name="fillOrRemainingCalculation"
                                               value="calculateFillVolume"
                                               [(ngModel)]="config.fillOrRemainingCalculation"/>
                                        <label for="calculateFillVolume">Calculate fill volume</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="currentFillPercentageLabel">Current fill percentage label</label>
                                <input type="text" class="form-control" id="currentFillPercentageLabel"
                                       name="currentFillPercentageLabel"
                                       placeholder="Set the label which will be displayed for the current fill percentage"
                                       [(ngModel)]="config.currentFillPercentageLabel" required>
                            </c8y-form-group>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Cylinder configuration -->

            <div class="row">
                <div class="configuration-panel">
                    <div class="row">
                        <div class="col-lg-12 configuration-panel-title">
                            Cylinder configuration
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-2">
                            <c8y-form-group>
                                <label for="cylinderHeight">Height (px)</label>
                                <input type="number" class="form-control" id="cylinderHeight" name="cylinderHeight"
                                       placeholder="Set the height of your cylinder" [ngModel]="config.cylinderHeight"
                                       (change)="setCylinderHeight($event)" required>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-2">
                            <c8y-form-group>
                                <label for="cylinderWidth">Width (px)</label>
                                <input type="number" class="form-control" id="cylinderWidth" name="cylinderWidth"
                                       placeholder="Set the width of your cylinder" [ngModel]="config.cylinderWidth"
                                       (change)="setCylinderWidth($event)" required>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-2">
                            <c8y-form-group>
                                <label for="cylinderLeftMargin">Left margin (px)</label>
                                <input type="number" class="form-control" id="cylinderLeftMargin"
                                       name="cylinderLeftMargin"
                                       placeholder="Adjust your cylinder by adding left margin"
                                       [ngModel]="config.cylinderLeftMargin"
                                       (change)="setCylinderLeftMargin($event)" required>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-2">
                            <c8y-form-group>
                                <label for="cylinderTopMargin">Top margin (px)</label>
                                <input type="number" class="form-control" id="cylinderTopMargin"
                                       name="cylinderTopMargin"
                                       placeholder="Adjust your cylinder position by adding top margin"
                                       [ngModel]="config.cylinderTopMargin"
                                       (change)="setCylinderTopMargin($event)" required>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-2">
                            <c8y-form-group>
                                <label for="cylinderTiltHeight">Tilt height (px)</label>
                                <input type="number" min="1" max="50" class="form-control" id="cylinderTiltHeight" name="cylinderTiltHeight"
                                       placeholder="Set the tilt height of your cylinder" [ngModel]="config.cylinderTiltHeight"
                                       (change)="setCylinderTiltHeight($event)" required>
                            </c8y-form-group>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-6">
                            <c8y-form-group>
                                <label for="cylinderColor">Cylinder color (hex,rgb,rgba)</label>
                                <input type="text" class="form-control" id="cylinderColor" name="cylinderColor"
                                       [(ngModel)]="config.cylinderColor"
                                       (click)="openCylinderColorPicker()" required/>
                                <app-color-picker
                                        [ngClass]="cylinderColorPickerClosed? 'hideColorPicker' : 'showColorPicker'"
                                        (colorPickerClosed)="closeCylinderColorPicker()"
                                        (colorSet)="setCylinderColor($event)">
                                </app-color-picker>
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-6">
                            <c8y-form-group>
                                <label for="cylinderFillColor">Cylinder fill color (hex,rgb,rgba)</label>
                                <input type="text" class="form-control" id="cylinderFillColor" name="cylinderFillColor"
                                       [(ngModel)]="config.cylinderFillColor"
                                       (click)="openCylinderFillColorPicker()" required/>
                                <app-color-picker
                                        [ngClass]="cylinderFillColorPickerClosed? 'hideColorPicker' : 'showColorPicker'"
                                        (colorPickerClosed)="closeCylinderFillColorPicker()"
                                        (colorSet)="setCylinderFillColor($event)">
                                </app-color-picker>
                            </c8y-form-group>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Foreground image configuration -->

            <div class="row">
                <div class="configuration-panel">
                    <div class="row">
                        <div class="col-lg-12 configuration-panel-title">
                            Foreground image configuration (optional)
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <c8y-form-group>
                                <label for="foregroundImageFile">image file (png, jpeg, jpg)</label>
                                <input type="file" class="form-control" id="foregroundImageFile"
                                       name="foregroundImageFile"
                                       alt="Foreground image file"
                                       accept=".png, .jpeg, .jpg" placeholder="Select the foreground image file"
                                       (change)="onForegroundImageFileUpdated($event)">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-offset-3 col-lg-3">
                            <div class="show-image-container">
                                <input type="checkbox" id="showForegroundImage" name="showForegroundImage"
                                       [(ngModel)]="config.showForegroundImage">
                                <label for="showForegroundImage">Show foreground image</label>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="foregroundImageHeight">Height (px)</label>
                                <input type="number" class="form-control" id="foregroundImageHeight"
                                       name="foregroundImageHeight"
                                       placeholder="Set the height of your foreground image"
                                       [(ngModel)]="config.foregroundImageHeight">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="foregroundImageWidth">Width (px)</label>
                                <input type="number" class="form-control" id="foregroundImageWidth"
                                       name="foregroundImageWidth"
                                       placeholder="Set the width of your foreground image"
                                       [(ngModel)]="config.foregroundImageWidth">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="foregroundImageLeftMargin">Left margin (px)</label>
                                <input type="number" class="form-control" id="foregroundImageLeftMargin"
                                       name="foregroundImageLeftMargin"
                                       placeholder="Adjust your foreground image position by adding left margin"
                                       [ngModel]="config.foregroundImageLeftMargin"
                                       (change)="setForegroundImageLeftMargin($event)">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="foregroundImageTopMargin">Top margin (px)</label>
                                <input type="number" class="form-control" id="foregroundImageTopMargin"
                                       name="foregroundImageTopMargin"
                                       placeholder="Adjust your overlay image position by adding top margin"
                                       [ngModel]="config.foregroundImageTopMargin"
                                       (change)="setForegroundImageTopMargin($event)">
                            </c8y-form-group>
                        </div>
                    </div>

                </div>
            </div>


            <!-- Background image configuration -->

            <div class="row">
                <div class="configuration-panel">
                    <div class="row">
                        <div class="col-lg-12 configuration-panel-title">
                            Background image configuration (optional)
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <c8y-form-group>
                                <label for="backgroundImageFile">image file (png, jpeg, jpg)</label>
                                <input type="file" class="form-control" id="backgroundImageFile"
                                       name="backgroundImageFile"
                                       alt="Background image file"
                                       accept=".png, .jpeg, .jpg" placeholder="Select the background image file"
                                       (change)="onBackgroundImageFileUpdated($event)">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-offset-3 col-lg-3">
                            <div class="show-image-container">
                                <input type="checkbox" id="showBackgroundImage" name="showBackgroundImage"
                                       [(ngModel)]="config.showBackgroundImage">
                                <label for="showBackgroundImage">Show background image</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="backgroundImageHeight">Height (px)</label>
                                <input type="number" class="form-control" id="backgroundImageHeight"
                                       name="backgroundImageHeight"
                                       placeholder="Set the height of your background image"
                                       [ngModel]="config.backgroundImageHeight"
                                       (change)="setBackgroundImageHeight($event)">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="backgroundImageWidth">Width (px)</label>
                                <input type="number" class="form-control" id="backgroundImageWidth"
                                       name="backgroundImageWidth"
                                       placeholder="Set the width of your background image"
                                       [ngModel]="config.backgroundImageWidth"
                                       (change)="setBackgroundImageWidth($event)">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="backgroundImageLeftMargin">Left margin (px)</label>
                                <input type="number" class="form-control" id="backgroundImageLeftMargin"
                                       name="backgroundImageLeftMargin"
                                       placeholder="Adjust your background image position by adding left margin"
                                       [ngModel]="config.backgroundImageLeftMargin"
                                       (change)="setBackgroundImageLeftMargin($event)">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-3">
                            <c8y-form-group>
                                <label for="backgroundImageTopMargin">Top margin (px)</label>
                                <input type="number" class="form-control" id="backgroundImageTopMargin"
                                       name="backgroundImageTopMargin"
                                       placeholder="Adjust your background image position by adding top margin"
                                       [ngModel]="config.backgroundImageTopMargin"
                                       (change)="setBackgroundImageTopMargin($event)">
                            </c8y-form-group>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Thresholds configuration -->

            <div class="row">
                <div class="configuration-panel thresholds-container">
                    <div class="row">
                        <div class="col-lg-12 configuration-panel-title">
                            Thresholds configuration (optional)
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12 configuration-panel-sub-title">
                            High threshold range
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="thresholdHighRangeMin">Minimum value (%)</label>
                                <input type="number" class="form-control" id="thresholdHighRangeMin"
                                       name="thresholdHighRangeMin"
                                       placeholder="Set the high range minimum value"
                                       [(ngModel)]="config.thresholdHighRangeMin">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="thresholdHighRangeMax">Maximum value (%)</label>
                                <input type="number" class="form-control" id="thresholdHighRangeMax"
                                       name="thresholdHighRangeMax"
                                       placeholder="Set the high range maximum value"
                                       [(ngModel)]="config.thresholdHighRangeMax">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="thresholdHighColourLabel">Color (hex,rgb,rgba)</label>
                                <input type="text" class="form-control" id="thresholdHighColourLabel"
                                       name="thresholdHighColourLabel"
                                       [(ngModel)]="config.thresholdHighColor"
                                       (click)="openThresholdHighColorPicker()"/>
                                <app-color-picker
                                        [ngClass]="thresholdHighColorPickerClosed? 'hideColorPicker' : 'showColorPicker'"
                                        (colorPickerClosed)="closeThresholdHighColorPicker()"
                                        (colorSet)="setThresholdHighColor($event)">
                                </app-color-picker>
                            </c8y-form-group>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12 configuration-panel-sub-title">
                            Medium threshold range
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="thresholdMediumRangeMin">Minimum value (%)</label>
                                <input type="number" class="form-control" id="thresholdMediumRangeMin"
                                       name="thresholdMediumRangeMin"
                                       placeholder="Set the medium range minimum value"
                                       [(ngModel)]="config.thresholdMediumRangeMin">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="thresholdMediumRangeMax">Maximum value (%)</label>
                                <input type="number" class="form-control" id="thresholdMediumRangeMax"
                                       name="thresholdMediumRangeMax"
                                       placeholder="Set the medium range maximum value"
                                       [(ngModel)]="config.thresholdMediumRangeMax">
                            </c8y-form-group>
                        </div>
                        <div class="col-lg-4">
                            <c8y-form-group>
                                <label for="thresholdMediumColourLabel">Color (hex,rgb,rgba)</label>
                                <input type="text" class="form-control" id="thresholdMediumColourLabel"
                                       name="thresholdMediumColourLabel"
                                       [(ngModel)]="config.thresholdMediumColor"
                                       (click)="openThresholdMediumColorPicker()"/>
                                <app-color-picker
                                        [ngClass]="thresholdMediumColorPickerClosed? 'hideColorPicker' : 'showColorPicker'"
                                        (colorPickerClosed)="closeThresholdMediumColorPicker()"
                                        (colorSet)="setThresholdMediumColor($event)">
                                </app-color-picker>
                            </c8y-form-group>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Optional configuration -->
            <div class="row">
                <div class="configuration-panel">
                    <div class="row">
                        <div class="col-lg-12 configuration-panel-title">
                            Development (optional)
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-3">
                            <div class="show-debug-container">
                                <input type="checkbox" id="showDebug" name="debugShow"
                                       [(ngModel)]="config.debugMode">
                                <label for="showDebug">Enable debug mode</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./silo-capacity-widget-config.component.css']
})
export class SiloCapacityWidgetConfig implements OnInit {

  @Input() config: WidgetConfig;

  private oldDeviceId: string = '';
  private foregroundImageFileAsString: string;
  private backgroundImageFileAsString: string;

  public cylinderFillColorPickerClosed = true;
  public cylinderColorPickerClosed = true;
  public thresholdHighColorPickerClosed = true;
  public thresholdMediumColorPickerClosed = true;

  public supportedSeries: string[];

  constructor(
      private http: HttpClient) {
  }

  ngOnInit() {
      // Populate the dropdown data if a device id has been previously selected
      if (this.config && this.config.device && this.config.device.id) {
          this.loadFragmentSeries();
      }
    }

    public async loadFragmentSeries(): Promise<void> {
        if ( !_.has(this.config, "device.id")) {
            console.log("Cannot get Measurement fragment and series because the device id is blank.");
        } else {
            if (this.oldDeviceId !== this.config.device.id) {
                const base64Auth: string = sessionStorage.getItem('_tcy8');
                let headersObject = new HttpHeaders();
                if (base64Auth === undefined || base64Auth.length === 0) {
                    console.log("Authorization details not found in session storage.");
                } else {
                    headersObject = headersObject.append('Authorization', 'Basic '+base64Auth);
                }
                const httpOptions = {headers: headersObject};
                const supportedSeriesResp: any = await this.http.get('/inventory/managedObjects/'+ this.config.device.id +'/supportedSeries', {...httpOptions}).toPromise();

                if (supportedSeriesResp !== undefined) {
                    this.supportedSeries = supportedSeriesResp.c8y_SupportedSeries;
                }
                this.oldDeviceId = this.config.device.id;
            }
        }
    }

    // Cylinder configuration

    public setCylinderHeight($event: Event) {
        const height: number = Number(($event.target as HTMLInputElement).value);
        if (height >= 0) {
            this.config.cylinderHeight = height;
        } else {
            console.error('Cylinder height must be a positive value');
        }
    }

    public setCylinderWidth($event: Event) {
        const width: number = Number(($event.target as HTMLInputElement).value);
        if (width >= 0) {
            this.config.cylinderWidth = width;
        } else {
            console.error('Cylinder width must be a positive value');
        }
    }

    public setCylinderTopMargin($event: Event) {
        const fillContainerTopMargin: number = Number(($event.target as HTMLInputElement).value);
        if (fillContainerTopMargin >= 0) {
            this.config.cylinderTopMargin = fillContainerTopMargin;
        } else {
            console.error('Cylinder top margin must be a positive value');
        }
    }

    public setCylinderLeftMargin($event: Event) {
        const fillContainerLeftMargin: number = Number(($event.target as HTMLInputElement).value);
        if (fillContainerLeftMargin >= 0) {
            this.config.cylinderLeftMargin = fillContainerLeftMargin;
        } else {
            console.error('Cylinder left margin must be a positive value');
        }
    }

    public setCylinderTiltHeight($event: Event) {
        let tiltHeight: number = Number(($event.target as HTMLInputElement).value);
        if (tiltHeight >= 0) {
            if (tiltHeight === 0 ) {
                tiltHeight = 1;
            }
            if (tiltHeight > 50) {
                tiltHeight = 50;
            }
            this.config.cylinderTiltHeight = tiltHeight;
        } else {
            console.error('Cylinder tilt height must be a positive value');
        }
    }


    public openCylinderColorPicker() {
        this.cylinderColorPickerClosed = false;
    }

    public closeCylinderColorPicker() {
        this.cylinderColorPickerClosed = true;
    }

    public setCylinderColor(value: string) {
        this.config.cylinderColor = value;
    }

    public openCylinderFillColorPicker() {
        this.cylinderFillColorPickerClosed = false;
    }

    public closeCylinderFillColorPicker() {
        this.cylinderFillColorPickerClosed = true;
    }

    public setCylinderFillColor(value: string) {
        this.config.cylinderFillColor = value;
    }

    public openThresholdHighColorPicker() {
        this.thresholdHighColorPickerClosed = false;
    }

    public closeThresholdHighColorPicker() {
        this.thresholdHighColorPickerClosed = true;
    }

    public setThresholdHighColor(value: string) {
        this.config.thresholdHighColor = value;
    }

    public openThresholdMediumColorPicker() {
        this.thresholdMediumColorPickerClosed = false;
    }

    public closeThresholdMediumColorPicker() {
        this.thresholdMediumColorPickerClosed = true;
    }

    public setThresholdMediumColor(value: string) {
        this.config.thresholdMediumColor = value;
    }

    // Foreground image configuration

    public onForegroundImageFileUpdated ($event: Event ) {
      const imageFile = ($event.target as HTMLInputElement).files[0];
      if (imageFile.type.match('image.*')) {
        if (['png', 'jpeg'].indexOf(imageFile.type.split("/")[1]) >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => {
            this.foregroundImageFileAsString = reader.result as string;
            _.set(this.config, 'foregroundImageText', this.foregroundImageFileAsString);
            // Set the 'showForegroundImage' flag as we have added a foreground image
            this.config.showForegroundImage = true;
          };
        } else {
          console.error('Image file can only be .png, .jpeg, or .jpg');         
        }
      } else {
        console.error('Image file must be either .png, .jpeg, or .jpg');
      }
    }

    public setForegroundImageLeftMargin($event: Event) {
        this.config.foregroundImageLeftMargin = Number(($event.target as HTMLInputElement).value);
    }

    public setForegroundImageTopMargin($event: Event) {
        this.config.foregroundImageTopMargin = Number(($event.target as HTMLInputElement).value);
    }


    // Background image configuration

    public onBackgroundImageFileUpdated ($event: Event ) {
        const imageFile = ($event.target as HTMLInputElement).files[0];
        if (imageFile.type.match('image.*')) {
            if (['png', 'jpeg'].indexOf(imageFile.type.split("/")[1]) >= 0) {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = () => {
                    this.backgroundImageFileAsString = reader.result as string;
                    _.set(this.config, 'backgroundImageText', this.backgroundImageFileAsString);
                    // Set the 'showBackgroundImage' flag as we have added a background image
                    this.config.showBackgroundImage = true;
                };
            } else {
                console.error('Background image file can only be .png, .jpeg, or .jpg');
            }
        } else {
            console.error('Background image file must be either .png, .jpeg, or .jpg');
        }
    }

    public setBackgroundImageHeight($event: Event) {
        const height: number = Number(($event.target as HTMLInputElement).value);
        if (height >= 0) {
            this.config.backgroundImageHeight = height;
        } else {
            console.error('Background image height must be a positive value');
        }
    }

    public setBackgroundImageWidth($event: Event) {
        const width: number = Number(($event.target as HTMLInputElement).value);
        if (width >= 0) {
            this.config.backgroundImageWidth = width;
        } else {
            console.error('Background image width must be a positive value');
        }
    }

    public setBackgroundImageLeftMargin($event: Event) {
        this.config.backgroundImageLeftMargin = Number(($event.target as HTMLInputElement).value);
    }

    public setBackgroundImageTopMargin($event: Event) {
        this.config.backgroundImageTopMargin = Number(($event.target as HTMLInputElement).value);
    }

}