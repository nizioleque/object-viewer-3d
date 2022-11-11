import { useEffect, useRef, useState } from 'react';
import { Point3D } from '../types';

interface PolarPoint {
  r: number;
  theta: number;
}

export interface LightOptions {
  position: PolarPoint;
  z: number;
}

const defaultLightOptions: LightOptions = {
  position: { r: 0, theta: 0 },
  z: 3,
};

const stepRadius = 0.005;
const stepTheta = Math.PI / 144;

const animationTime = 16;

export const getLightPoint = (lightOptions: LightOptions): Point3D => {
  const x = lightOptions.position.r * Math.cos(lightOptions.position.theta);
  const y = lightOptions.position.r * Math.sin(lightOptions.position.theta);
  return { x, y, z: lightOptions.z };
};

export default function useLightOptions() {
  const [lightOptions, _setLightOptions] =
    useState<LightOptions>(defaultLightOptions);

  const _animateLightPosition = () => {
    _setLightOptions((oldValue) => ({
      z: oldValue.z,
      position: {
        r: oldValue.position.r + stepRadius,
        theta: oldValue.position.theta + stepTheta,
      },
    }));
  };

  const animationInterval = useRef<NodeJS.Timer | undefined>(undefined);

  const startAnimation = () => {
    pauseAnimation();
    animationInterval.current = setInterval(() => {
      _animateLightPosition();
    }, animationTime);
  };

  const pauseAnimation = () => {
    if (animationInterval.current) {
      clearInterval(animationInterval.current);
      animationInterval.current = undefined;
    }
  };

  const resetAnimation = () => {
    pauseAnimation();
    _setLightOptions((oldValue) => ({
      z: oldValue.z,
      position: defaultLightOptions.position,
    }));
  };

  useEffect(() => {
    return () => {
      if (animationInterval) clearInterval(animationInterval.current);
    };
  }, []);

  const setLightZ = (value: number) => {
    const newZ = +value.toFixed(2);
    _setLightOptions((oldValue) => ({
      position: oldValue.position,
      z: newZ,
    }));
  };

  return {
    lightOptions,
    animationActions: {
      startAnimation,
      pauseAnimation,
      resetAnimation,
      setLightZ,
    },
  };
}
