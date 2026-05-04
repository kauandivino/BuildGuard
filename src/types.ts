export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface MaterialRisk {
  id: string;
  name: string;
  stage: string;
  riskLevel: RiskLevel;
  riskScore: number;
  estimatedWaste: string;
  recommendation: string;
  status: 'pending' | 'resolved' | 'warning';
}

export interface ConsumptionData {
  name: string;
  planned: number;
  estimated: number;
}
