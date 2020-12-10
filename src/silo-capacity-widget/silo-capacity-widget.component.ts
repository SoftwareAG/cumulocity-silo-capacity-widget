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
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { WidgetConfig } from './i-widget-config';
import * as _ from 'lodash'
import { Realtime, MeasurementService } from '@c8y/ngx-components/api';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'silo-capacity-widget',
  templateUrl: './silo-capacity-widget.component.html',
  styleUrls: ['./silo-capacity-widget.component.css']
})
export class SiloCapacityWidget implements OnInit, OnDestroy {
  
  @Input() public config: WidgetConfig;

  private realtimeMeasurement$;

  public currentFillPercentage = 0;
  public currentFillLevel = 100;

  public cylinderStyle = new BehaviorSubject<{tiltHeight: string, width: string, height: string, borderRadius: string, fillContainerTopMargin: string, fillContainerLeftMargin: string, backgroundColor: string}>({tiltHeight: '20px', width: '100px', height: '300px', borderRadius: '100px/20px', fillContainerTopMargin: '5px', fillContainerLeftMargin: '5px', backgroundColor: 'rgba(160, 160, 160, 1.0)'});
  public fillStyle = new BehaviorSubject<{tiltHeight: string, bottom: string, height: string, 'backgroundColor': string, borderRadius: string, top: string}>({tiltHeight: '20px', bottom: '0', height: '0', backgroundColor: 'rgba(245, 222, 179, 1)', borderRadius: '100px/20px', 'top': '0px'});

  private foregroundImagePlaceHolder: ElementRef;
  private backgroundImagePlaceHolder: ElementRef;

  private ctrlKeyPressed = false;
  private mouseMoveForegroundImageTopMargin: number;
  private mouseMoveForegroundImageLeftMargin: number;
  private mouseMoveBackgroundImageTopMargin: number;
  private mouseMoveBackgroundImageLeftMargin: number;

  private displayedAlert = false;

  // This ViewChild is only used when in debug mode to allow the user to move the foreground and backgrounds image around
  @ViewChild('foregroundImagePlaceHolder', {read: ElementRef, static: false}) set foregroundImage(foregroundImage: ElementRef) {
    if (foregroundImage) {
      this.foregroundImagePlaceHolder = foregroundImage;

      this.foregroundImagePlaceHolder.nativeElement.ondragstart = function() {
        return false;
      };

      let mouseDown = false;

      this.foregroundImagePlaceHolder.nativeElement.onmousedown = ( (event) => {
        if (this.config.debugMode) {
          // If the control key is held down, we will update the config left and top positions on mouseup - the user can then 'edit' and save the widget to make these changes permanent
          this.ctrlKeyPressed = !!event.ctrlKey;
          mouseDown = true;
        }
      });

      this.foregroundImagePlaceHolder.nativeElement.onmouseleave = ( () => {
        mouseDown = false;
        this.saveForegroundAndBackgroundImageLocations();
      });

      this.foregroundImagePlaceHolder.nativeElement.onmouseup = ( () => {
        if (mouseDown) {
          mouseDown = false;
          this.saveForegroundAndBackgroundImageLocations();
        }
      });

      this.foregroundImagePlaceHolder.nativeElement.onmousemove = (event => {
        if (mouseDown) {
          // Foreground Image
          const newForegroundMarginLeft = event.layerX - event.offsetX - (event.movementX * -1);
          this.mouseMoveForegroundImageLeftMargin = newForegroundMarginLeft;
          this.foregroundImagePlaceHolder.nativeElement.style["marginLeft"] = newForegroundMarginLeft + 'px';
          const newForegroundMarginTop = event.layerY - event.offsetY - (event.movementY * -1)
          this.mouseMoveForegroundImageTopMargin = newForegroundMarginTop;
          this.foregroundImagePlaceHolder.nativeElement.style["marginTop"] = newForegroundMarginTop + 'px';

          // Background Image
          const newBackgroundMarginLeft = this.backgroundImagePlaceHolder.nativeElement.offsetLeft - (event.movementX * -1);
          this.mouseMoveBackgroundImageLeftMargin = newBackgroundMarginLeft;
          this.backgroundImagePlaceHolder.nativeElement.style["left"] = newBackgroundMarginLeft + 'px';
          const newBackgroundMarginTop = this.backgroundImagePlaceHolder.nativeElement.offsetTop - (event.movementY * -1);
          this.mouseMoveBackgroundImageTopMargin = newBackgroundMarginTop;
          this.backgroundImagePlaceHolder.nativeElement.style["top"] = newBackgroundMarginTop + 'px';
        }
      });
    }
  }

  @ViewChild('backgroundImagePlaceHolder', {read: ElementRef, static: false}) set backgroundImage(backgroundImage: ElementRef) {
    if (backgroundImage) {
      this.backgroundImagePlaceHolder = backgroundImage;
    }
  }

  constructor(
    private realtime: Realtime,
    private measurementService: MeasurementService) {
  }

  public ngOnInit(): void {

    // set the initial state
    this.setWidgetInitialState()
        .then( () => {
            // Only subscribe to realtime measurements if we're not in debugMode
            if (!this.config.debugMode) {
              // Subscribe to real-time measurements
              this.realtimeMeasurement$ = this.realtime.subscribe(`/measurements/${this.config.device.id}`, realtimeData => {
                const measurementFragmentAndSeries = this.config.measurementSeries.split('.');
                if (_.has(realtimeData.data.data, `${measurementFragmentAndSeries[0]}.${measurementFragmentAndSeries[1]}`)) {
                  // console.log('Received realtime measurement: ', JSON.stringify(realtimeData.data.data[measurementFragmentAndSeries[0]][measurementFragmentAndSeries[1]]));
                  const measurementValue = realtimeData.data.data[measurementFragmentAndSeries[0]][measurementFragmentAndSeries[1]].value;
                  this.setCurrentFillPercentage(measurementValue);
                }
              });
            }
        })
        .catch(error => {
          console.error(`'Cylinder Fill Widget': ${error}`);
          alert(`'Cylinder Fill Widget': ${error}`);
    });
  }

  private saveForegroundAndBackgroundImageLocations() {
    if (this.ctrlKeyPressed) {
      // Update the config foreground and background data with the adjusted top margin and left margin positions
      this.config.foregroundImageTopMargin = this.mouseMoveForegroundImageTopMargin;
      this.config.foregroundImageLeftMargin = this.mouseMoveForegroundImageLeftMargin;
      this.config.backgroundImageTopMargin = this.mouseMoveBackgroundImageTopMargin;
      this.config.backgroundImageLeftMargin = this.mouseMoveBackgroundImageLeftMargin;
      if (!this.displayedAlert) {
        alert('Silo Capacity Widget: To save the new foreground and background image locations, edit the widget and click save, otherwise refresh the page to reset back to original')
        this.displayedAlert = true;
      }
    } else {
      this.resetForegroundImageLocation(this.foregroundImagePlaceHolder);
      this.resetBackgroundImageLocation(this.backgroundImagePlaceHolder);
    }
  }

  private async setWidgetInitialState() {
    return new Promise( async (resolve, reject) => {
      if (this.config.measurementSeries !== undefined) {

        // Set the defaults if the information wasn't entered in the widget configuration screen
        if (this.config.cylinderHeight === undefined) {
          this.config.cylinderHeight = 140;
        }

        if (this.config.cylinderWidth === undefined) {
          this.config.cylinderWidth = 80;
        }

        if (this.config.cylinderTopMargin === undefined) {
          this.config.cylinderTopMargin = 15;
        }

        if (this.config.cylinderLeftMargin === undefined) {
          this.config.cylinderLeftMargin = 45;
        }

        if (this.config.cylinderTiltHeight === undefined) {
          this.config.cylinderTiltHeight = 15;
        }

        if (this.config.cylinderColor === undefined) {
          this.config.cylinderColor = 'rgba(160, 160, 160, 0.5)';
        }

        if (this.config.cylinderFillColor === undefined) {
          this.config.cylinderFillColor = '#e1b35fff';
        }

        if (this.config.fillLevelMaximumLabel === undefined) {
          this.config.fillLevelMaximumLabel = 'Max capacity';
        }

        if (this.config.fillLevelMaximumAmount === undefined) {
          this.config.fillLevelMaximumAmount = 750;
        }

        if (this.config.fillLevelUnit === undefined) {
          this.config.fillLevelUnit = 'tonnes';
        }

        if (this.config.fillOrRemainingLabel === undefined) {
          this.config.fillOrRemainingLabel = 'Fill volume';
        }

        if (this.config.currentFillPercentageLabel === undefined) {
          this.config.currentFillPercentageLabel = 'Current fill level';
        }

        if (this.config.fillOrRemainingCalculation === undefined) {
          this.config.fillOrRemainingCalculation = 'calculateRemainingVolume';
        }

        if (this.config.showForegroundImage === undefined) {
          this.config.showForegroundImage = false;
        }

        if (this.config.showBackgroundImage === undefined) {
          this.config.showBackgroundImage = false;
        }

        if (this.config.debugMode === undefined) {
          this.config.debugMode = false;
        }

        if (this.config.showForegroundImage) {
          if (this.config.foregroundImageHeight === undefined) {
            this.config.foregroundImageHeight = 207;
          }
          if (this.config.foregroundImageWidth === undefined) {
            this.config.foregroundImageWidth = 120;
          }
          if (this.config.foregroundImageLeftMargin === undefined) {
            this.config.foregroundImageLeftMargin = 20;
          }
          if (this.config.foregroundImageTopMargin === undefined) {
            this.config.foregroundImageTopMargin = -2;
          }
        }

        if (this.config.showBackgroundImage) {
          if (this.config.backgroundImageHeight === undefined) {
            this.config.backgroundImageHeight = 160;
          }
          if (this.config.backgroundImageWidth === undefined) {
            this.config.backgroundImageWidth = 100;
          }
          if (this.config.backgroundImageLeftMargin === undefined) {
            this.config.backgroundImageLeftMargin = 34;
          }
          if (this.config.backgroundImageTopMargin === undefined) {
            this.config.backgroundImageTopMargin = 12;
          }
        }

        if (this.config.enableThresholds === undefined) {
          this.config.enableThresholds = false;
        }

        const borderRadius = this.config.cylinderWidth + 'px/' + this.config.cylinderTiltHeight + 'px';
        this.cylinderStyle.next({
          tiltHeight: this.config.cylinderTiltHeight + 'px',
          width: this.config.cylinderWidth + 'px',
          height: this.config.cylinderHeight + 'px',
          borderRadius: borderRadius,
          fillContainerTopMargin: this.config.cylinderTopMargin + 'px',
          fillContainerLeftMargin: this.config.cylinderLeftMargin + 'px',
          backgroundColor: this.config.cylinderColor
        });

        this.fillStyle.next({
          tiltHeight: this.config.cylinderTiltHeight + 'px',
          bottom: '0',
          height: '0',
          backgroundColor: this.getCylinderFillColor(),
          borderRadius: borderRadius,
          top: '0'
        });

        // Only retrieve the latest historical measurement if we're not in debugMode
        if (!this.config.debugMode) {
          if (this.config.device && this.config.device.id) {
            // Get the measurement configuration details
            const measurement = this.config.measurementSeries.split('.');
            if (measurement.length !== 2) {
              reject('Measurement Series is invalid');
            }
            const measurementFragment = measurement[0];
            const measurementSeries = measurement[1];

            // Get the events ordered by creation date DESC
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 0);
            const dateTo = endOfToday.toISOString();

            const filter = {
              source: this.config.device.id,
              dateFrom: '1970-01-01',
              dateTo,
              valueFragmentType: measurementFragment,
              valueFragmentSeries: measurementSeries,
              pageSize: 1,
              revert: true
            };

            // Get the latest historical measurement for this {measurementFragment.measurementSeries}
            const {data} = await this.measurementService.list(filter);

            if (data.length > 0) {
              const measurementObject = data[0];
              const measurementValue = measurementObject[measurementFragment][measurementSeries].value;
              this.setCurrentFillPercentage(measurementValue);
            }
          } else {
            console.log('Unable to subscribe to realtime measurements as no device has been selected');
          }
        } else {
          // for debug mode purposes, set the initial measurement to 25%
          this.setCurrentFillPercentage(25);
        }
        resolve();
      } else {
        reject('Measurement series has not been defined in the widget configuration');
      }
    });

  }

  private getCylinderFillColor(): string {
    let cylinderFillColour = '';
    if(this.config.enableThresholds) {
      cylinderFillColour = this.getThresholdColor();
    }
    if (cylinderFillColour === '') {
      cylinderFillColour = this.config.cylinderFillColor;
    }
    return cylinderFillColour;
  }

  ngOnDestroy(): void {
    // Unsubscribe from realtime measurement subscriptions
    if( this.realtimeMeasurement$ !== undefined ) {
      this.realtime.unsubscribe(this.realtimeMeasurement$);
    }
  }

  public setCurrentFillPercentage(currentFillPercentage: number) {
    const borderRadius = this.config.cylinderWidth + 'px/' + this.config.cylinderTiltHeight + 'px';

    if (this.config.fillOrRemainingCalculation === 'calculateRemainingVolume') {
      // Calculate the remaining amount by volume
      this.currentFillLevel = this.config.fillLevelMaximumAmount * (currentFillPercentage / 100);
      this.currentFillPercentage = currentFillPercentage;
    }
    if (this.config.fillOrRemainingCalculation === 'calculateFillVolume') {
      // Calculate the filled amount by volume
      this.currentFillLevel = this.config.fillLevelMaximumAmount - (this.config.fillLevelMaximumAmount * (currentFillPercentage / 100));
      this.currentFillPercentage = currentFillPercentage;
    }

    if (currentFillPercentage === 0) {
      const fillTop = this.config.cylinderHeight + 'px'
      this.fillStyle.next({
        tiltHeight: this.config.cylinderTiltHeight + 'px',
        bottom: '0',
        height: '0',
        backgroundColor: this.getCylinderFillColor(),
        borderRadius: borderRadius,
        'top': fillTop
      });
    } else {
      let fillHeight = 0;

      if (this.config.fillOrRemainingCalculation === 'calculateRemainingVolume') {
        fillHeight = ((this.config.cylinderHeight - 25) * currentFillPercentage / 100) + 25;
      }
      if (this.config.fillOrRemainingCalculation === 'calculateFillVolume') {
        fillHeight = ((this.config.cylinderHeight - 25) - (this.config.cylinderHeight - 25) * currentFillPercentage / 100) + 25;
      }

      const fillHeightpx = fillHeight + 'px';
      const fillTop = (Number(this.config.cylinderHeight) - fillHeight).toString() + 'px';
      this.fillStyle.next({
        tiltHeight: this.config.cylinderTiltHeight + 'px',
        bottom: '0',
        height: fillHeightpx,
        backgroundColor: this.getCylinderFillColor(),
        borderRadius: borderRadius,
        'top': fillTop
      });
    }

  }

  public getForegroundImage(): string {
    if (this.config.foregroundImageText) {
      return _.get(this.config, 'foregroundImageText');
    } else {
      return '';
    }
  }

  public getBackgroundImage(): string {
    if (this.config.backgroundImageText) {
      return _.get(this.config, 'backgroundImageText');
    } else {
      return '';
    }
  }

  public setThresholdColorStyle(): object {
    let thresholdColor = '';
    if (this.config.enableThresholds) {
      thresholdColor = this.getThresholdColor();
    }

    if (thresholdColor === '') {
      thresholdColor = 'green'
    }

    return {'color': `${thresholdColor}`};
  }

  private getThresholdColor(): string {

    // High threshold
    if (this.currentFillPercentage >= this.config.thresholdHighRangeMin && this.currentFillPercentage <= this.config.thresholdHighRangeMax) {
      return this.config.thresholdHighColor;
    }

    // Medium threshold
    if (this.currentFillPercentage >= this.config.thresholdMediumRangeMin && this.currentFillPercentage <= this.config.thresholdMediumRangeMax) {
      return this.config.thresholdMediumColor;
    }

    return '';
  }


  private resetForegroundImageLocation(foregroundImagePlaceHolder) {
    foregroundImagePlaceHolder.nativeElement.style["marginLeft"] = this.config.foregroundImageLeftMargin + 'px';
    foregroundImagePlaceHolder.nativeElement.style["marginTop"] = this.config.foregroundImageTopMargin + 'px';
  }

  private resetBackgroundImageLocation(backgroundImagePlaceHolder) {
    backgroundImagePlaceHolder.nativeElement.style["left"] = this.config.backgroundImageLeftMargin + 'px';
    backgroundImagePlaceHolder.nativeElement.style["top"] = this.config.backgroundImageTopMargin + 'px';
  }


}