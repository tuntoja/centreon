import { Meta, StoryObj } from '@storybook/react';

import dataLastWeek from '../LineChart/mockedData/lastWeek.json';

import { SingleBar } from '.';

const meta: Meta<typeof SingleBar> = {
  component: SingleBar
};

export default meta;
type Story = StoryObj<typeof SingleBar>;

const Template = (props): JSX.Element => (
  <div style={{ height: '500px', width: '500px' }}>
    <SingleBar {...props} />
  </div>
);

export const success: Story = {
  args: {
    data: dataLastWeek,
    thresholdTooltipLabels: ['Warning', 'Critical'],
    thresholds: [0.5, 1.5]
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

export const lowThresholdsCritical: Story = {
  args: {
    data: dataLastWeek,
    isLowThresholds: true,
    thresholdTooltipLabels: ['Critical', 'Warning'],
    thresholds: [0.42, 0.5]
  },
  render: Template
};

export const lowThresholdWarning: Story = {
  args: {
    data: dataLastWeek,
    isLowThresholds: true,
    thresholdTooltipLabels: ['Critical', 'Warning'],
    thresholds: [0.15, 0.5]
  },
  render: Template
};

export const lowThresholdSuccess: Story = {
  args: {
    data: dataLastWeek,
    isLowThresholds: true,
    thresholdTooltipLabels: ['Critical', 'Warning'],
    thresholds: [0.15, 0.4]
  },
  render: Template
};
