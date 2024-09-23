import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ZillowService } from './zillow.service';

/**
 * Controller for handling requests to the Zillow API
 */
@Controller('zillow')
export class ZillowController {
    constructor(private readonly zillowService: ZillowService) {}

    /**
     * Controller endpoint for getting the latest mortgage rates
     * @param request - contains query parameters
     * @returns object containing mortgage rates and aother data
     */
    @Post('rates')
    currentRates(@Body() options: object): object {

        if (options['durationDays'] && options['durationDays'] <= 0 || options['durationDays'] > 4000) {
            throw new HttpException('Invalid duration window', HttpStatus.BAD_REQUEST);
        }

        return this.zillowService.getCurrentRates(options);
    }
}
