import { useEffect, useMemo } from 'react';

import { useFormikContext } from 'formik';
import { propEq, find } from 'ramda';
import { useAtom, useAtomValue } from 'jotai';

import { Widget, WidgetPropertyProps } from '../models';
import { FederatedWidgetOptionType } from '../../../../federatedModules/models';
import { widgetPropertiesAtom } from '../atoms';

import {
  WidgetMetrics,
  WidgetResources,
  WidgetRichTextEditor,
  WidgetTextField
} from './Inputs';

import { useDeepCompare } from 'packages/ui/src';
import { federatedWidgetsPropertiesAtom } from 'www/front_src/src/federatedModules/atoms';

export interface WidgetPropertiesRenderer {
  Component: (props: WidgetPropertyProps) => JSX.Element;
  key: string;
  props: {
    label: string;
    propertyName: string;
    propertyType: string;
    required?: boolean;
    type: FederatedWidgetOptionType;
  };
}

export const propertiesInputType = {
  [FederatedWidgetOptionType.textfield]: WidgetTextField,
  [FederatedWidgetOptionType.resources]: WidgetResources,
  [FederatedWidgetOptionType.metrics]: WidgetMetrics,
  [FederatedWidgetOptionType.richText]: WidgetRichTextEditor
};

const DefaultComponent = (): JSX.Element => <div />;

export const useWidgetInputs = (
  widgetKey: string
): Array<WidgetPropertiesRenderer> | null => {
  const { values, validateForm } = useFormikContext<Widget>();

  const [widgetProperties, setWidgetProperties] = useAtom(widgetPropertiesAtom);
  const federatedWidgetsProperties = useAtomValue(
    federatedWidgetsPropertiesAtom
  );

  const selectedWidgetProperties =
    find(
      propEq('moduleName', values.moduleName),
      federatedWidgetsProperties || []
    )?.[widgetKey] || null;

  const inputs = useMemo(
    () =>
      selectedWidgetProperties
        ? Object.entries(selectedWidgetProperties).map(([key, value]) => {
            const Component =
              propertiesInputType[value.type] || DefaultComponent;

            return {
              Component,
              key,
              props: {
                label: value.label,
                propertyName: key,
                propertyType: widgetKey,
                required: value.required,
                type: value.type
              }
            };
          })
        : null,
    [selectedWidgetProperties]
  );

  useEffect(() => {
    setWidgetProperties(inputs);
  }, useDeepCompare([inputs]));

  useEffect(() => {
    validateForm();
  }, useDeepCompare([widgetProperties]));

  return inputs;
};