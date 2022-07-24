export interface NavItem {
  id: number;
  url: string;
  description?: string;
  tags?: string;
  title?: string;
  icon?: string;
  remark?: string;
}

export interface RuleItem {
  name: string;
  days: string[];
  start_time: number;
  end_time: number;
  navs: number[];
  id?: number
}
