import { Meta, StoryObj } from '@storybook/react';

import dataLastWeek from '../LineChart/mockedData/lastWeek.json';

import { Gauge } from './Gauge';

const meta: Meta<typeof Gauge> = {
  component: Gauge
};

export default meta;
type Story = StoryObj<typeof Gauge>;

const Template = (props): JSX.Element => (
  <div style={{ height: '500px', width: '500px' }}>
    <Gauge {...props} />
  </div>
);

export const success: Story = {
  args: {
    data: dataLastWeek,
    thresholdTooltipLabels: ['Warning', 'Critical'],
    thresholds: [0.5, 0.6]
  },
  render: Template
};

export const warning: Story = {
  args: {
    data: dataLastWeek,
    thresholdTooltipLabels: ['Warning', 'Critical'],
    thresholds: [0.2, 0.5]
  },
  render: Template
};

export const critical: Story = {
  args: {
    data: dataLastWeek,
    thresholdTooltipLabels: ['Warning', 'Critical'],
    thresholds: [0.13, 0.35]
  },
  render: Template
};

export const lowThresholdSuccess: Story = {
  args: {
    data: dataLastWeek,
    isLowThresholds: true,
    thresholdTooltipLabels: ['Critical', 'Warning'],
    thresholds: [0.1, 0.2]
  },
  render: Template
};

export const lowThresholdWarning: Story = {
  args: {
    data: dataLastWeek,
    isLowThresholds: true,
    thresholdTooltipLabels: ['Critical', 'Warning'],
    thresholds: [0.1, 0.6]
  },
  render: Template
};

export const lowThresholdCritical: Story = {
  args: {
    data: dataLastWeek,
    isLowThresholds: true,
    thresholdTooltipLabels: ['Critical', 'Warning'],
    thresholds: [0.45, 0.6]
  },
  render: Template
};
