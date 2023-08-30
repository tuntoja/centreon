import { LineChartData } from '../common/models';

export interface SingleBarProps {
  data?: LineChartData;
  disabledThresholds?: boolean;
  isLowThresholds?: boolean;
  thresholdTooltipLabels: Array<string>;
  thresholds: Array<number>;
}
