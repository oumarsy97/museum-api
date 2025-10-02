import { Test, TestingModule } from '@nestjs/testing';
import { DescriptionController } from './description.controller';
import { DescriptionService } from './description.service';

describe('DescriptionController', () => {
  let controller: DescriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DescriptionController],
      providers: [DescriptionService],
    }).compile();

    controller = module.get<DescriptionController>(DescriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
