import { Test, TestingModule } from '@nestjs/testing';
import { ProductItemController } from './product-item.controller';

describe('ProductItemController', () => {
  let controller: ProductItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductItemController],
    }).compile();

    controller = module.get<ProductItemController>(ProductItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
