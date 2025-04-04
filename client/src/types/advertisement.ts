
export interface Advertisement {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  position: string;
  startDate: Date;
  endDate: Date | null;
  clickCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdvertisementInput {
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  active?: boolean;
  startDate?: Date;
  endDate?: Date | null;
}

export interface UpdateAdvertisementInput extends Partial<CreateAdvertisementInput> {
  id: number;
}
