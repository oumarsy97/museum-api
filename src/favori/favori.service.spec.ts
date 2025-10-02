import { Test, TestingModule } from '@nestjs/testing';
import { FavoriService } from './favori.service';

describe('FavoriService', () => {
  let service: FavoriService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriService],
    }).compile();

    service = module.get<FavoriService>(FavoriService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
