import { useEffect, useMemo } from 'react';

import { useFormikContext } from 'formik';
import { propEq, find } from 'ramda';
import { useAtom, useAtomValue } from 'jotai';

import { Widget, WidgetPropertyProps } from '../models';
import { FederatedWidgetOptionType } from '../../../../federatedModules/models';
import { widgetPropertiesAtom } from '../atoms';
import { federatedWidgetsPropertiesAtom } from '../../../../federatedModules/atoms';

import { WidgetTextField } from './Inputs';

import { useDeepCompare } from 'packages/ui/src';

export interface WidgetPropertiesRenderer {
  Component: (props: WidgetPropertyProps) => JSX.Element;
  key: string;
  props: {
    label: string;
    propertyName: string;
    required?: boolean;
    type: FederatedWidgetOptionType;
  };
}

export const propertiesInputType = {
  [FederatedWidgetOptionType.textfield]: WidgetTextField
};

export const useWidgetProperties =
  (): Array<WidgetPropertiesRenderer> | null => {
    const { values, validateForm } = useFormikContext<Widget>();

    const [widgetProperties, setWidgetProperties] =
      useAtom(widgetPropertiesAtom);
    const federatedWidgetsProperties = useAtomValue(
      federatedWidgetsPropertiesAtom
    );

    const selectedWidgetProperties =
      find(
        propEq('moduleName', values.moduleName),
        federatedWidgetsProperties || []
      )?.options || null;

    const inputs = useMemo(
      () =>
        selectedWidgetProperties
          ? Object.entries(selectedWidgetProperties).map(([key, value]) => {
              const Component = propertiesInputType[value.type];

              return {
                Component,
                key,
                props: {
                  label: value.label,
                  propertyName: key,
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
