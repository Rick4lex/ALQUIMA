import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  category?: string;
  title?: string;
  description: string;
  details?: string;
  imageUrls: string[];
  imageHint: string;
  price?: string;
  available?: boolean;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
