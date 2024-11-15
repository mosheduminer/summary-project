/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  HTTPValidationError,
  Region,
} from '../models/index';
import {
    HTTPValidationErrorFromJSON,
    HTTPValidationErrorToJSON,
    RegionFromJSON,
    RegionToJSON,
} from '../models/index';

export interface AnalyzeAnalyzePostRequest {
    requestBody: Array<string>;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * Analyze
     */
    async analyzeAnalyzePostRaw(requestParameters: AnalyzeAnalyzePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Region>>> {
        if (requestParameters.requestBody === null || requestParameters.requestBody === undefined) {
            throw new runtime.RequiredError('requestBody','Required parameter requestParameters.requestBody was null or undefined when calling analyzeAnalyzePost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/analyze`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.requestBody,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RegionFromJSON));
    }

    /**
     * Analyze
     */
    async analyzeAnalyzePost(requestParameters: AnalyzeAnalyzePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Region>> {
        const response = await this.analyzeAnalyzePostRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
