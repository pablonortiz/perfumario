import React from 'react';
import { View } from 'react-native';
import { PerfumeCardSkeleton } from './PerfumeCardSkeleton';

interface PerfumeListSkeletonProps {
  count?: number;
}

export const PerfumeListSkeleton: React.FC<PerfumeListSkeletonProps> = ({
  count = 5,
}) => {
  return (
    <View>
      {Array.from({ length: count }, (_, index) => (
        <PerfumeCardSkeleton key={index} />
      ))}
    </View>
  );
};

export default PerfumeListSkeleton;
