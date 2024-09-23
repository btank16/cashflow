import { Test, TestingModule } from '@nestjs/testing';
import { ZillowService } from './zillow.service';
import { HttpModule } from '@nestjs/axios';

describe('ZillowService', () => {
    let service: ZillowService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ZillowService],
            imports: [HttpModule]
        }).compile();

        service = module.get<ZillowService>(ZillowService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
