import { MaterialRisk, ConsumptionData } from './types';

export const INITIAL_RISKS: MaterialRisk[] = [
  {
    id: '1',
    name: 'Argamassa (M10)',
    stage: 'Acabamento',
    riskLevel: 'HIGH',
    riskScore: 0.88,
    estimatedWaste: '18%',
    recommendation: 'Corrigir dosagem e reduzir lotes de preparação imediatamente.',
    status: 'warning',
  },
  {
    id: '4',
    name: 'Pisos Cerâmicos',
    stage: 'Revestimento Interno',
    riskLevel: 'HIGH',
    riskScore: 0.76,
    estimatedWaste: '14%',
    recommendation: 'Ajustar estoque de segurança para reduzir desperdício por quebra.',
    status: 'warning',
  },
  {
    id: '2',
    name: 'Cimento de Alta Resistência',
    stage: 'Suporte Estrutural',
    riskLevel: 'MEDIUM',
    riskScore: 0.54,
    estimatedWaste: '9%',
    recommendation: 'Revisar umidade no Setor B para evitar perda de material.',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Aço de Reforço',
    stage: 'Fundações',
    riskLevel: 'LOW',
    riskScore: 0.12,
    estimatedWaste: '3%',
    recommendation: 'Manter protocolo padrão de corte.',
    status: 'resolved',
  },
  {
    id: '5',
    name: 'Tijolos de Vedação',
    stage: 'Alvenaria',
    riskLevel: 'LOW',
    riskScore: 0.15,
    estimatedWaste: '4%',
    recommendation: 'Monitorar quebras durante o descarregamento.',
    status: 'resolved',
  },
  {
    id: '6',
    name: 'Tubulações PVC',
    stage: 'Hidrossanitária',
    riskLevel: 'LOW',
    riskScore: 0.08,
    estimatedWaste: '2%',
    recommendation: 'Verificar conexões de sobras no Almoxarifado.',
    status: 'resolved',
  }
];

export const CONSUMPTION_HISTORY: ConsumptionData[] = [
  { name: 'Semana 1', planned: 4000, estimated: 4200 },
  { name: 'Semana 2', planned: 3000, estimated: 3800 },
  { name: 'Semana 3', planned: 2000, estimated: 2400 },
  { name: 'Semana 4', planned: 2780, estimated: 3908 },
  { name: 'Semana 5', planned: 1890, estimated: 2800 },
  { name: 'Semana 6', planned: 2390, estimated: 3800 },
];
