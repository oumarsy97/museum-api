import { Test, TestingModule } from '@nestjs/testing';
import { OeuvreService } from './oeuvre.service';

describe('OeuvreService', () => {
  let service: OeuvreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OeuvreService],
    }).compile();

    service = module.get<OeuvreService>(OeuvreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
