import { Test, TestingModule } from '@nestjs/testing';
import { EvenementsController } from './evenements.controller';
import { EvenementsService } from './evenements.service';

describe('EvenementsController', () => {
  let controller: EvenementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvenementsController],
      providers: [EvenementsService],
    }).compile();

    controller = module.get<EvenementsController>(EvenementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
