import { Test, TestingModule } from '@nestjs/testing';
import { ZillowController } from './zillow.controller';
import { ZillowService } from './zillow.service';
import { HttpModule } from '@nestjs/axios';

describe('ZillowController', () => {
    let controller: ZillowController;
    let zillowService: ZillowService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ZillowController],
            providers: [ZillowService],
            imports: [HttpModule]
        }).compile();

        controller = module.get<ZillowController>(ZillowController);
        zillowService = module.get<ZillowService>(ZillowService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    /**
     * this test ensures that the currentRates endpoint returns an object type response
     */
    describe('currentRates', () => {
        it('should return an object', async () => {
            let options = {
                partnerId: "test"
            }

            const result = { message: "success" }
            jest.spyOn(zillowService, 'getCurrentRates').mockResolvedValue(result);

            expect(await controller.currentRates(options)).toEqual(result);
        }) 
    });
});
