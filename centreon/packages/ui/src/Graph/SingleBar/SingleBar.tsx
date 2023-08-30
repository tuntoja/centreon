import { Responsive } from '@visx/visx';

import { SingleBarProps } from './models';
import ResponsiveSingleBar from './ResponsiveSingleBar';

const SingleBar = ({ data, thresholds, ...props }: SingleBarProps): JSX.Element | null => {
  if (!data) {
    return null;
  }

  return (
    <Responsive.ParentSizeModern>
      {({ width, height }) => (
        <ResponsiveSingleBar
          {...props}
          data={data}
          height={height}
          width={width}
          thresholds={thresholds.sort()}
        />
      )}
    </Responsive.ParentSizeModern>
  );
};

export default SingleBar;
