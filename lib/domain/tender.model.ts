export interface Tender {
  id: number;
  organizationId: string;
  details: string;
  openAt: string;
  closeAt: string;
  documentUrl?: string;
  document_buy_option: boolean;
  documentPrice?: string;
  status: 'CLOSED' | 'OPEN' | 'DRAFT';
}
