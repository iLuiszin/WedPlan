import type ExcelJS from 'exceljs';
import type { IGuest } from '@/models/guest';
import { CATEGORY_LABELS, ROLE_LABELS } from './constants';

const COLUMN_CONFIG = [
  { header: 'Nome Completo', key: 'fullName', width: 32 },
  { header: 'Categoria', key: 'category', width: 16 },
  { header: 'Função', key: 'role', width: 16 },
  { header: 'Parceiro', key: 'partner', width: 32 },
] as const;

const DEFAULT_CATEGORY_LABEL = 'Categoria desconhecida';
const DEFAULT_ROLE_LABEL = 'Função desconhecida';

const getCategoryLabel = (category: IGuest['category']): string => {
  return CATEGORY_LABELS[category] ?? DEFAULT_CATEGORY_LABEL;
};

const getRoleLabel = (role: IGuest['role']): string => {
  return ROLE_LABELS[role] ?? DEFAULT_ROLE_LABEL;
};

const buildFullName = (guest: IGuest): string => {
  const firstName = guest.firstName.trim();
  const lastName = guest.lastName?.trim();
  return lastName ? `${firstName} ${lastName}`.trim() : firstName;
};

const createPartnerLookup = (guests: IGuest[]): Map<string, IGuest> => {
  return guests.reduce((map, guest) => {
    map.set(guest._id.toString(), guest);
    return map;
  }, new Map<string, IGuest>());
};

export async function buildGuestsWorkbook(
  guests: IGuest[],
  ExcelJS: typeof import('exceljs').default
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'WedPlan';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Convidados', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  worksheet.columns = COLUMN_CONFIG.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width,
    style: { alignment: { vertical: 'middle' } },
  }));

  const partnerLookup = createPartnerLookup(guests);

  guests.forEach((guest) => {
    const partnerId = guest.partnerId ? guest.partnerId.toString() : undefined;
    const partnerGuest = partnerId ? partnerLookup.get(partnerId) : undefined;
    const partnerName = partnerGuest ? buildFullName(partnerGuest) : '';

    worksheet.addRow({
      fullName: buildFullName(guest),
      category: getCategoryLabel(guest.category),
      role: getRoleLabel(guest.role),
      partner: partnerName,
    });
  });

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 20;

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: COLUMN_CONFIG.length },
  };

  worksheet.eachRow((row, index) => {
    if (index === 1) {
      return;
    }
    row.alignment = { vertical: 'middle' };
    row.height = 18;
  });

  return workbook.xlsx.writeBuffer();
}
