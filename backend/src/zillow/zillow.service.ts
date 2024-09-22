import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ZillowService {
    
    constructor(private readonly httpService: HttpService) {}
    private readonly logger = new Logger(ZillowService.name);

    MORTGAGE_API = 'https://mortgageapi.zillow.com/api/getRates'
    PARTNER_ID = ''
    
    /**
     * Sends a GET request to the Zillow API to fetch the latest mortgage rates
     * https://www.zillowgroup.com/developers/api/mortgage/get-current-rates/
     * @returns a Promise containing an object
     */
    // async getCurrentRates(options): Promise<object> {
    //     const { data } = await firstValueFrom(
    //         this.httpService.get<object>(this.MORTGAGE_API, options).pipe(
    //             catchError((error: AxiosError) => {
    //                 this.logger.error(error.response.data);
    //                 throw 'An error occurred!';
    //             }),
    //         ),
    //     );
    //     return data;
    // }

    /**
     * this method can be used for testing. It prints out a log containing the options parameters
     * and returns an object containing a message and the options parameters
     * @param options 
     * @returns 
     */
    getCurrentRates(options): object {
        this.logger.log(options);
        return {
            message: "success",
            options: options
        }
    }
}
