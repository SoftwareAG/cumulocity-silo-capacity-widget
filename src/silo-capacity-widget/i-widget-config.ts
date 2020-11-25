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
export interface WidgetConfig {
    device?: {
        id: string;
        name: string;
    };

    measurementSeries: string;

    cylinderHeight: number;
    cylinderWidth: number;
    cylinderTopMargin: number;
    cylinderLeftMargin: number;
    cylinderTiltHeight: number;
    cylinderColor: string;
    cylinderFillColor: string;

    fillLevelMaximumLabel: string;
    fillLevelMaximumAmount: number;
    fillLevelUnit: string;
    fillOrRemainingLabel: string
    fillOrRemainingCalculation: string;
    currentFillPercentageLabel: string;

    foregroundImageText: string;
    foregroundImageHeight: number;
    foregroundImageWidth: number;
    foregroundImageTopMargin: number;
    foregroundImageLeftMargin: number;

    backgroundImageText: string;
    backgroundImageHeight: number;
    backgroundImageWidth: number;
    backgroundImageTopMargin: number;
    backgroundImageLeftMargin: number;

    thresholdHighRangeMin: number;
    thresholdHighRangeMax: number;
    thresholdHighColor: string;

    thresholdMediumRangeMin: number;
    thresholdMediumRangeMax: number;
    thresholdMediumColor: string;

    showForegroundImage: boolean;
    showBackgroundImage: boolean;
    debugMode: boolean;
}