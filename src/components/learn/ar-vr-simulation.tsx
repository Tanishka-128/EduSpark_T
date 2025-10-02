'use client';

import 'aframe';
import { Scene, Entity } from 'aframe-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { View } from 'lucide-react';

export default function ARVRSimulation() {
  const [isSupported, setIsSupported] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // A-Frame's VR mode detection is asynchronous and relies on the browser's capabilities.
    // We check for navigator.xr which is the modern standard for WebXR.
    if (navigator.xr) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            setIsSupported(supported);
            setHasChecked(true);
        }).catch(() => {
            setIsSupported(false);
            setHasChecked(true);
        });
    } else {
        setIsSupported(false);
        setHasChecked(true);
    }
  }, []);

  if (!hasChecked) {
    return <p>Checking for AR/VR support...</p>;
  }

  if (!isSupported) {
    return (
      <Alert variant="default">
        <View className="h-4 w-4" />
        <AlertTitle>AR/VR Not Supported</AlertTitle>
        <AlertDescription>
          Your device or browser does not support AR/VR experiences. Please try on a supported device like a VR headset or a modern smartphone.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='h-[500px] w-full'>
        <Scene embedded>
            <Entity geometry={{ primitive: 'box' }} material={{ color: 'purple' }} position={{ x: 0, y: 1, z: -3 }}
                animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear;">
            </Entity>
            <Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100" />
            <Entity primitive="a-sky" color="#ECECEC" />
            <Entity light={{ type: 'point' }} position={{ x: 2, y: 4, z: 4 }} />
        </Scene>
    </div>
  );
}
