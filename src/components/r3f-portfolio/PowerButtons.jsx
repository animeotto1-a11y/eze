import React from 'react';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { Power } from 'lucide-react';

export default function PowerButtons({
  bootAudio,
  turnComputerFansOn,
  turnComputerFansOff,
  powerOn,
  powerOff,
  finishBooting,
  powerOnButtonRef,
  powerOffButtonRef,
  closeButtonRef,
  screenLightOn,
  screenLightOff,
  lightRef,
  screenRef,
  soundEnabled = true,
}) {
  const handlePowerOn = (e) => {
    e?.stopPropagation();

    if (soundEnabled) {
      try {
        bootAudio.currentTime = 0;
        bootAudio.play().catch(() => {});
      } catch (err) {}
      turnComputerFansOn();
    }

    powerOn();

    // Hide Power On button
    if (powerOnButtonRef?.current) {
      gsap.to(powerOnButtonRef.current, {
        opacity: 0,
        duration: 0.4,
        display: 'none',
        ease: 'power1.inOut',
        onStart: () => {
          if (powerOnButtonRef.current) powerOnButtonRef.current.style.pointerEvents = 'none';
        },
      });
    }

    // Show Power Off button
    if (powerOffButtonRef?.current) {
      gsap.to(powerOffButtonRef.current, {
        opacity: 1,
        duration: 1,
        display: 'flex',
        ease: 'power1.inOut',
        onComplete: () => {
          if (powerOffButtonRef.current) powerOffButtonRef.current.style.display = 'flex';
        },
      });
    }

    // Turn screen ambient light on
    screenLightOn(lightRef);

    // Boot sequence finishes after 4.5s
    setTimeout(() => {
      finishBooting();
      if (screenRef?.current) {
        gsap.to(screenRef.current, {
          opacity: 1,
          duration: 1,
          display: 'block',
        });
      }
      if (powerOffButtonRef?.current) {
        powerOffButtonRef.current.style.pointerEvents = 'auto';
      }
      if (closeButtonRef?.current) {
        closeButtonRef.current.style.pointerEvents = 'auto';
      }
    }, 4500);
  };

  const handlePowerOff = (e) => {
    e?.stopPropagation();

    powerOff();
    if (soundEnabled) {
      turnComputerFansOff();
    }

    if (powerOffButtonRef?.current) {
      gsap.to(powerOffButtonRef.current, {
        opacity: 0,
        duration: 0.5,
        display: 'none',
        ease: 'power1.inOut',
        onStart: () => {
          if (powerOffButtonRef.current) powerOffButtonRef.current.style.pointerEvents = 'none';
        },
      });
    }

    if (powerOnButtonRef?.current) {
      gsap.to(powerOnButtonRef.current, {
        opacity: 1,
        duration: 1,
        display: 'flex',
        ease: 'power1.inOut',
        onComplete: () => {
          if (powerOnButtonRef.current) {
            powerOnButtonRef.current.style.display = 'flex';
            powerOnButtonRef.current.style.pointerEvents = 'auto';
          }
        },
      });
    }

    if (screenRef?.current) {
      gsap.to(screenRef.current, {
        opacity: 0,
        duration: 0.7,
        display: 'none',
      });
    }

    screenLightOff(lightRef);
  };

  return (
    <>
      {/* Power On Button on the keyboard */}
      <Html
        transform
        position={[0.993, 0.5, -1.07]}
        rotation={[Math.PI * 0.5, 0, Math.PI * 1]}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          display: 'none',
        }}
        ref={powerOnButtonRef}
      >
        <div
          onClick={handlePowerOn}
          className="cursor-pointer pulsing p-1 rounded-full bg-neutral-900 border border-white/60 flex items-center justify-center hover:scale-125 transition-transform shadow-lg"
          title="Allumer l'ordinateur portable"
        >
          <Power className="w-2.5 h-2.5 text-white" />
        </div>
      </Html>

      {/* Power Off Button on the keyboard */}
      <Html
        transform
        position={[0.993, 0.5, -1.07]}
        rotation={[Math.PI * 0.5, 0, Math.PI * 1]}
        style={{ opacity: 0, display: 'none' }}
        ref={powerOffButtonRef}
      >
        <div
          onClick={handlePowerOff}
          className="cursor-pointer p-1 rounded-full bg-neutral-900 border border-amber-400 flex items-center justify-center hover:scale-125 transition-transform shadow-lg"
          title="Éteindre l'ordinateur portable"
        >
          <Power className="w-2.5 h-2.5 text-amber-400" />
        </div>
      </Html>
    </>
  );
}
