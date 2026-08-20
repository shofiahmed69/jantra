import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../../common/entities/product.entity';
import { TenantContext } from '../../common/tenant/tenant.context';
import bwipjs from 'bwip-js';
import PDFDocument from 'pdfkit';

@Injectable()
export class BarcodesService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  private ensureProductBarcode(product: Product): string {
    if (product.barcode && product.barcode.trim().length > 0) return product.barcode;
    const generated = `RX${product.id.replace(/-/g, '').slice(0, 12).toUpperCase()}`;
    product.barcode = generated;
    this.productRepo.save(product).catch(() => null);
    return generated;
  }

  async generate(productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId, pharmacyId: this.pid } });
    if (!product) throw new NotFoundException('Product not found');
    const code = this.ensureProductBarcode(product);

    const png = await bwipjs.toBuffer({
      bcid: 'code128',
      text: code,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
      backgroundcolor: 'FFFFFF',
    });

    return {
      productId: product.id,
      productName: product.name,
      barcode: code,
      mimeType: 'image/png',
      imageBase64: png.toString('base64'),
    };
  }

  async printSheet(productIds: string[]) {
    const products = await this.productRepo.find({
      where: { id: In(productIds), pharmacyId: this.pid },
    });
    const valid = products.map((p) => ({ ...p, barcode: this.ensureProductBarcode(p) }));

    const doc = new PDFDocument({ size: 'A4', margin: 20 });
    const chunks: Buffer[] = [];
    doc.on('data', (d) => chunks.push(d));

    const cellW = 180;
    const cellH = 95;
    let x = 20;
    let y = 20;
    let col = 0;

    for (const p of valid) {
      const png = await bwipjs.toBuffer({
        bcid: 'code128',
        text: p.barcode!,
        scale: 2,
        height: 10,
        includetext: true,
        textxalign: 'center',
        backgroundcolor: 'FFFFFF',
      });

      doc.rect(x, y, cellW, cellH).stroke('#D1D5DB');
      doc.fontSize(9).text(p.name, x + 6, y + 6, { width: cellW - 12 });
      doc.image(png, x + 6, y + 24, { fit: [cellW - 12, 50] });

      col += 1;
      x += cellW + 10;
      if (col === 3) {
        col = 0;
        x = 20;
        y += cellH + 10;
      }
      if (y + cellH > 800) {
        doc.addPage();
        x = 20;
        y = 20;
        col = 0;
      }
    }

    doc.end();
    await new Promise<void>((resolve) => doc.on('end', () => resolve()));

    return Buffer.concat(chunks);
  }
}
