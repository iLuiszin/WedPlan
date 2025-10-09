import type * as ExcelJSNamespace from 'exceljs';
import type { Row } from 'exceljs';
import type { IGuest } from '@/models/guest';
import type { SerializedDocument } from '@/types/mongoose-helpers';
import { CATEGORY_LABELS, ROLE_LABELS } from './constants';

type ExcelJSModule = typeof ExcelJSNamespace;
type SerializedGuest = SerializedDocument<IGuest>;

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

const buildFullName = (guest: SerializedGuest): string => {
  const firstName = guest.firstName.trim();
  const lastName = guest.lastName?.trim();
  return lastName ? `${firstName} ${lastName}`.trim() : firstName;
};

const createPartnerLookup = (guests: SerializedGuest[]): Map<string, SerializedGuest> => {
  return guests.reduce((map, guest) => {
    map.set(guest._id, guest);
    return map;
  }, new Map<string, SerializedGuest>());
};

export async function buildGuestsWorkbook(
  guests: SerializedGuest[],
  ExcelJS: ExcelJSModule
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
    const partnerId = guest.partnerId ? String(guest.partnerId) : null;
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

  worksheet.eachRow((row: Row, rowNumber: number) => {
    if (rowNumber === 1) {
      return;
    }
    row.alignment = { vertical: 'middle' };
    row.height = 18;
  });

  return workbook.xlsx.writeBuffer();
}
