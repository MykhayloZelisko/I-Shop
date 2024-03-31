export interface CategoryInterface {
  id: string;
  categoryName: string;
  parentId: string | null;
  level: number;
}
