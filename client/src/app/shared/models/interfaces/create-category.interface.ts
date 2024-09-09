export interface CreateCategoryInterface {
  categoryName: string;
  parentId: string | null;
  image: string | null;
  icon: string | null;
  level: number;
}
