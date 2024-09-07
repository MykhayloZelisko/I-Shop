export interface CategoryDataInterface {
  categoryName: string;
  image: File[];
  base64image: string | null;
  parentId: string | null;
  level: number;
}
