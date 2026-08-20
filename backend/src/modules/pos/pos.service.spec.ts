import { UnprocessableEntityException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PosService } from './pos.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DashboardGateway } from '../../common/realtime/dashboard.gateway';
import { TenantContext } from '../../common/tenant/tenant.context';
import { Product } from '../../common/entities/product.entity';
import { Sale } from '../../common/entities/sale.entity';
import { SaleItem } from '../../common/entities/sale-item.entity';
import { StockMovement } from '../../common/entities/stock-movement.entity';

describe('PosService', () => {
  function setup(stockQuantity = 10) {
    const product: Product = {
      id: 'prod-1',
      name: 'Paracetamol',
      costPrice: '5.00',
      sellingPrice: '10.00',
      stockQuantity,
      minStockAlert: 3,
      unitType: 'piece',
      piecesPerStrip: 1,
      stripsPerBox: null,
      pharmacyId: 'pharm-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    const saleCreated: Sale = {
      id: 'sale-1',
      invoiceNumber: 'INV-20260101-00001',
      saleDate: new Date(),
      subtotal: '20.00',
      discountAmount: '0.00',
      taxAmount: '0.00',
      totalAmount: '20.00',
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: new Date(),
    } as Sale;

    const productRepo = {
      findOne: jest.fn(async ({ where: { id, pharmacyId } }) => (id === 'prod-1' && pharmacyId === 'pharm-1' ? product : null)),
      save: jest.fn(async (p) => p),
    };
    const saleRepo = {
      create: jest.fn((v) => v),
      save: jest.fn(async () => saleCreated),
    };
    const saleItemRepo = {
      create: jest.fn((v) => v),
      save: jest.fn(async (v) => v as SaleItem),
    };
    const movementRepo = {
      create: jest.fn((v) => v),
      save: jest.fn(async (v) => v as StockMovement),
    };

    const queryRunner = {
      connect: jest.fn(async () => undefined),
      startTransaction: jest.fn(async () => undefined),
      commitTransaction: jest.fn(async () => undefined),
      rollbackTransaction: jest.fn(async () => undefined),
      release: jest.fn(async () => undefined),
      manager: {
        getRepository: jest.fn((entity) => {
          if (entity === Product) return productRepo;
          if (entity === Sale) return saleRepo;
          if (entity === SaleItem) return saleItemRepo;
          if (entity === StockMovement) return movementRepo;
          throw new Error('Unknown repo');
        }),
      },
    };

    const saleLookupRepo = {
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn(async () => []),
      })),
    };

    const dataSource = {
      createQueryRunner: jest.fn(() => queryRunner),
      getRepository: jest.fn((entity) => {
        if (entity === Sale) return saleLookupRepo;
        throw new Error('Unknown ds repo');
      }),
    } as unknown as DataSource;

    const notifications = {
      createIfMissingUnread: jest.fn(async () => undefined),
    } as unknown as NotificationsService;

    const dashboardGateway = {
      emitDashboardUpdate: jest.fn(),
    } as unknown as DashboardGateway;

    const tenant = { pharmacyId: 'pharm-1' } as TenantContext;

    const service = new PosService(dataSource, notifications, dashboardGateway, tenant);

    return { service, queryRunner, product, dashboardGateway };
  }

  it('creates sale and emits dashboard update', async () => {
    const { service, queryRunner, product, dashboardGateway } = setup(10);

    const result = await service.createSale({
      items: [{ product_id: 'prod-1', quantity: 2, discount_percent: 0 }],
      discount_amount: 0,
      tax_amount: 0,
      payment_method: 'cash',
    });

    expect(result.id).toBe('sale-1');
    expect(product.stockQuantity).toBe(8);
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect((dashboardGateway.emitDashboardUpdate as jest.Mock)).toHaveBeenCalledWith('pharm-1', expect.any(Object));
  });

  it('rolls back when stock is insufficient and does not emit update', async () => {
    const { service, queryRunner, dashboardGateway } = setup(1);

    await expect(
      service.createSale({
        items: [{ product_id: 'prod-1', quantity: 2, discount_percent: 0 }],
        discount_amount: 0,
        tax_amount: 0,
        payment_method: 'cash',
      }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect((dashboardGateway.emitDashboardUpdate as jest.Mock)).not.toHaveBeenCalled();
  });

  it('deducts pieces when selling by strip', async () => {
    const { service, product } = setup(120);
    product.piecesPerStrip = 12;

    await service.createSale({
      items: [{ product_id: 'prod-1', quantity: 2, unit: 'strip', discount_percent: 0 }],
      discount_amount: 0,
      tax_amount: 0,
      payment_method: 'cash',
    });

    expect(product.stockQuantity).toBe(96);
  });
});
