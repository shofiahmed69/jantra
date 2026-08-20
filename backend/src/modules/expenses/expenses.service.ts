import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../../common/entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { TenantContext } from '../../common/tenant/tenant.context';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private readonly expenseRepo: Repository<Expense>,
    private readonly tenant: TenantContext,
  ) {}

  private get pid() {
    return this.tenant.pharmacyId;
  }

  async list(from?: string, to?: string, category?: string, page = 1, limit = 20) {
    const qb = this.expenseRepo
      .createQueryBuilder('e')
      .where('e.pharmacy_id = :pid', { pid: this.pid })
      .orderBy('e.expense_date', 'DESC');
    if (from) qb.andWhere('e.expense_date >= :from', { from });
    if (to) qb.andWhere('e.expense_date <= :to', { to });
    if (category) qb.andWhere('e.category = :category', { category });
    const [items, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  create(dto: CreateExpenseDto) {
    return this.expenseRepo.save(
      this.expenseRepo.create({
        pharmacyId: this.pid,
        category: dto.category,
        description: dto.description,
        amount: dto.amount.toFixed(2),
        expenseDate: dto.expense_date,
        note: dto.note,
      }),
    );
  }

  async update(id: string, payload: Partial<Expense>) {
    await this.expenseRepo.update(
      { id, pharmacyId: this.pid },
      {
        category: payload.category,
        description: payload.description,
        amount: payload.amount,
        expenseDate: payload.expenseDate,
        note: payload.note,
      },
    );
    const row = await this.expenseRepo.findOne({ where: { id, pharmacyId: this.pid } });
    if (!row) throw new NotFoundException('Expense not found');
    return row;
  }

  async remove(id: string) {
    await this.expenseRepo.softDelete({ id, pharmacyId: this.pid });
    return { id, deleted: true };
  }

  async daily(date?: string) {
    const d = date || new Date().toISOString().slice(0, 10);
    const rows = await this.expenseRepo.find({ where: { expenseDate: d, pharmacyId: this.pid } });
    const total = rows.reduce((s, r) => s + Number(r.amount), 0);
    return { date: d, count: rows.length, total: Number(total.toFixed(2)), items: rows };
  }

  async monthly(month?: string) {
    const m = month || new Date().toISOString().slice(0, 7);
    const rows = await this.expenseRepo
      .createQueryBuilder('e')
      .select('e.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(e.amount),0)', 'total')
      .where('e.pharmacy_id = :pid', { pid: this.pid })
      .andWhere("TO_CHAR(e.expense_date, 'YYYY-MM') = :m", { m })
      .groupBy('e.category')
      .orderBy('total', 'DESC')
      .getRawMany();

    const total = rows.reduce((s, r) => s + Number(r.total), 0);
    return { month: m, total: Number(total.toFixed(2)), breakdown: rows };
  }
}
