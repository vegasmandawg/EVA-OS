
export interface ISimpleSolution {
  uuid: string;
  name: string;
  description: string;
  metadata: IMetadata;
  type: string;
  created_at: string;
  updated_at: string;
}

interface IMetadata {
  icon?: string;
  iconType?: string;
  iconBackground?: string;
}