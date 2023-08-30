import { Responsive } from '@visx/visx';

import { LineChartData } from '../common/models';
import { getMetricWithLatestData } from '../common/timeSeries';
import { Metric } from '../common/timeSeries/models';

import ResponsiveGauge from './ResponsiveGauge';

interface Props {
  data?: LineChartData;
  disabledThresholds?: boolean;
  isLowThresholds?: boolean;
  thresholdTooltipLabels: Array<string>;
  thresholds: Array<number>;
}

export const Gauge = ({
  thresholds,
  data,
  thresholdTooltipLabels,
  disabledThresholds,
  isLowThresholds
}: Props): JSX.Element | null => {
  if (!data) {
    return null;
  }

  const metric = getMetricWithLatestData(data) as Metric;

  return (
    <Responsive.ParentSize>
      {({ width, height }) => (
        <ResponsiveGauge
          disabledThresholds={disabledThresholds}
          height={height}
          isLowThresholds={isLowThresholds}
          metric={metric}
          thresholdTooltipLabels={thresholdTooltipLabels}
          thresholds={thresholds}
          width={width}
        />
      )}
    </Responsive.ParentSize>
  );
};
