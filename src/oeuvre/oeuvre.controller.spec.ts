import { Test, TestingModule } from '@nestjs/testing';
import { OeuvreController } from './oeuvre.controller';
import { OeuvreService } from './oeuvre.service';

describe('OeuvreController', () => {
  let controller: OeuvreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OeuvreController],
      providers: [OeuvreService],
    }).compile();

    controller = module.get<OeuvreController>(OeuvreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
