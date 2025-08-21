export interface Tender {
  id: string;
  buyerId: string;
  details: string;
  openAt: string;
  closeAt: string;
  documentUrl?: string;
  document_buy_option: boolean;
}
