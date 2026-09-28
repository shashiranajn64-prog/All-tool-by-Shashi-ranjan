export type ToolCategory = 'image' | 'pdf' | 'text' | 'utility';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  shortDesc: string;
  description: string;
  iconName: string;
  seoTitle: string;
  seoDesc: string;
  path: string;
  popular?: boolean;
}
