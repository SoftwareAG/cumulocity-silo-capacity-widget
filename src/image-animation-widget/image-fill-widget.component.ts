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
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { WidgetConfig } from './i-widget-config';
import { Realtime, MeasurementService } from '@c8y/ngx-components/api';
import {BehaviorSubject} from "rxjs";
const isBase64 = require('is-base64');

@Component({
  selector: 'image-animation-widget',
  templateUrl: './image-fill-widget.component.html',
  styleUrls: ['./image-fill-widget.component.css']
})
export class ImageFillWidget implements  OnInit, OnDestroy {
  
  @Input() public config: WidgetConfig;

  private realtimeMeasurementsSubscription;

  public measurementValue: number = 0;
  public cylinderHeight = '300px';
  public fillStyle = new BehaviorSubject<{bottom: string, height: string}>({bottom: '0', height: '0'});

  constructor(
    private realtime: Realtime,
    private measurementService: MeasurementService) {
  }

  public ngOnInit(): void {

    // set the initial state
    this.setWidgetInitialState();

    // Listen for 'AnimationAction' and 'AnimationConfiguration' events
    // this.realtimeEventsSubscription = this.realtime
    //     .subscribe(`/events/${this.config.device.id}`, (measurement: ICumulocityMeasurement) => {
    //         this.processMeasurement(event.data.data.type, event.data.data.text);
    // });
  }

  private processMeasurement(type: string, text: string) {
    //TODO
  }

  private async setWidgetInitialState() {

    // Get the events ordered by creation date DESC
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 0);
    const dateTo = endOfToday.toISOString();

    if (this.config.device && this.config.device.id) {
      const getMeasurementsResponse: any = await this.measurementService.list({
            source: this.config.device.id,
            dateTo,
            revert: false,
            pageSize: 100
          }
      );
    } else {
      console.log('Unable to subscribe to realtime measurements as no device has been selected');
    }
  }

  public ngOnDestroy() {
    // this.realtime.unsubscribe(this.realtimeMeasurementsSubscription);
  }

  public setMeasurementValue(value: number) {
    if (value === 0) {
      this.fillStyle.next({bottom: '0', height: '0'});
    } else {
      const fillHeight = ((250 * value / 100) + 50).toString() + 'px';
      this.fillStyle.next({bottom: '0', height: fillHeight});

    }
    const currentFillStyle = this.fillStyle.getValue();
    console.log('this.fillStyle.bottom is ', currentFillStyle.bottom, 'this.fillStyle.height is ', currentFillStyle.height);
    this.measurementValue = value;
  }
}
