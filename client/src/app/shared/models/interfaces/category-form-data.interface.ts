export interface CategoryFormDataInterface {
  categoryName: string;
  image: File[];
  base64image: string | null;
  parentId: string | null;
  level: number;
}
