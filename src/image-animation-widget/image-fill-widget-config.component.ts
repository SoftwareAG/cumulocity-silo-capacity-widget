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
import { Component, Input } from '@angular/core';
import { WidgetConfig } from './i-widget-config';
import _ from 'lodash';

@Component({
    template: `
      <div class="form-group">
        
        <c8y-form-group>
          <label for="imageFile">Image file (png, jpeg, jpg)</label>
          <input type="file" class="form-control" id="imageFile" name="imageFile" alt="Image file" style="width:100%" accept=".png, .jpeg, .jpg" placeholder="Select the image file" (change)="onImageFileUpdated($event)" required>
        </c8y-form-group>

        <c8y-form-group>
          <label for="height">Height (in pixels)</label>
          <input type="string" class="form-control" id="height" name="height" style="width:100%" placeholder="Set the height of your image" [ngModel]="config.height" required>
        </c8y-form-group>

        <c8y-form-group>
          <label for="width">Width (in pixels)</label>
          <input type="string" class="form-control" id="width" name="width" style="width:100%" placeholder="Set the width of your image" [ngModel]="config.width" required>
        </c8y-form-group>

        <c8y-form-group>
          <label for="measurementLabel">Measurement label</label>
          <input type="text" class="form-control" id="measurementLabel" name="measurementLabel" style="width:100%" placeholder="Set the label which will be displayed" [(ngModel)]="config.measurementLabel">
        </c8y-form-group>

        <c8y-form-group>
          <label for="measurementUnit">Measurement unit</label>
          <input type="text" class="form-control" id="measurementUnit" name="measurementUnit" style="width:100%" placeholder="Enter a unit to override the unit description for the measurement" [(ngModel)]="config.measurementUnit">
        </c8y-form-group>

        <c8y-form-group>
          <label for="description">Description</label>
          <input type="text" class="form-control" id="description" name="description" style="width:100%" placeholder="Enter the description for your widget" [(ngModel)]="config.description">
        </c8y-form-group>
        

      </div>
      
    `
})
export class ImageFillWidgetConfig {

  private imageFileAsString: string;

  @Input() config: WidgetConfig = {
      imageText: '',
      height: '250px',
      width: '100px',
      measurementLabel: '',
      measurementUnit: '',
      description: ''
    };

    public onImageFileUpdated ($event: Event ) {
      const imageFile = ($event.target as HTMLInputElement).files[0];
      if (imageFile.type.match('image.*')) {
        if (['png', 'jpeg'].indexOf(imageFile.type.split("/")[1]) >= 0) {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => {
            this.imageFileAsString = reader.result as string;
            _.set(this.config, 'imageText', this.imageFileAsString);
          };
        } else {
          console.error('Image file can only be .png, .jpeg, or .jpg');         
        }
      } else {
        console.error('Image file must be either .png, .jpeg, or .jpg');
      }
    }

    // public setHeight($event: Event) {
    //   const height: number = Number(($event.target as HTMLInputElement).value);
      // if (height >= 0) {
      //   this.config.height = height;
      // } else {
      //   console.error('height must be a positive value');
      // }
    // }

    // public setWidth($event: Event) {
    //   const width: number = Number(($event.target as HTMLInputElement).value);
    //   if (width >= 0) {
    //     this.config.width = width;
    //   } else {
    //     console.error('width must be a positive value');
    //   }
    // }

    // public setRemainingImagePercentage($event: Event) {
    //   const remainingImagePercentage: number = Number(($event.target as HTMLInputElement).value);
    //   if (remainingImagePercentage >= 0 && remainingImagePercentage <= 100) {
    //     this.config.remainingImagePercentage = remainingImagePercentage;
    //   } else {
    //     console.error('remainingImagePercentage must be between 0 and 100');
    //   }
    // }

    // public setRotationInDegrees($event: Event) {
    //   const rotationInDegrees: number = Number(($event.target as HTMLInputElement).value);
    //   if (rotationInDegrees >= -360 && rotationInDegrees <= 360) {
    //     this.config.rotationInDegrees = rotationInDegrees;
    //   } else {
    //     console.error('setRotationInDegrees must be between -360 and 360');
    //   }
    // }

    // public setAnimationTimeInSeconds($event: Event) {
    //   const animationTimeInSeconds: number = Number(($event.target as HTMLInputElement).value);
    //   if (animationTimeInSeconds >= 0 && animationTimeInSeconds <= 3600) {
    //     this.config.animationTimeInSeconds = animationTimeInSeconds;
    //   } else {
    //     console.error('animationTimeInSeconds must be between 0 and 3600');
    //   }
    // }

}