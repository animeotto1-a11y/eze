import React, { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { LoopOnce } from 'three';
import gsap from 'gsap';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function HingeButtons({
  animationsObject,
  isOpen,
  open,
  close,
  openButtonRef,
  closeButtonRef,
  powerOnButtonRef,
  powerOffButtonRef,
  screenLightOn,
  screenLightOff,
  lightRef,
  isPoweredOn,
  isFinishedBooting,
  screenRef,
}) {
  useEffect(() => {
    // Show Open button with elegant fade-in
    const timer = setTimeout(() => {
      if (openButtonRef?.current) {
        gsap.to(openButtonRef.current.style, {
          opacity: 1,
          duration: 1,
          display: 'flex',
          ease: 'power1.inOut',
          onComplete: () => {
            if (openButtonRef.current) {
              openButtonRef.current.style.pointerEvents = 'auto';
              openButtonRef.current.style.cursor = 'pointer';
            }
          },
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Update button visibility when isOpen state changes
  useEffect(() => {
    if (isOpen) {
      // Laptop is open -> hide open button, show close button
      if (openButtonRef?.current) {
        gsap.to(openButtonRef.current.style, {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.inOut',
          onStart: () => {
            if (openButtonRef.current) openButtonRef.current.style.pointerEvents = 'none';
          },
          onComplete: () => {
            if (openButtonRef.current) openButtonRef.current.style.display = 'none';
          },
        });
      }

      if (closeButtonRef?.current) {
        gsap.to(closeButtonRef.current.style, {
          opacity: 1,
          delay: 1.2,
          duration: 1,
          onStart: () => {
            if (closeButtonRef.current) {
              closeButtonRef.current.style.display = 'flex';
              closeButtonRef.current.style.pointerEvents = 'none';
            }
          },
          onComplete: () => {
            if (closeButtonRef.current) closeButtonRef.current.style.pointerEvents = 'auto';
          },
        });
      }
    } else {
      // Laptop is closed -> hide close button, show open button
      if (closeButtonRef?.current) {
        gsap.to(closeButtonRef.current.style, {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.inOut',
          onStart: () => {
            if (closeButtonRef.current) closeButtonRef.current.style.pointerEvents = 'none';
          },
          onComplete: () => {
            if (closeButtonRef.current) closeButtonRef.current.style.display = 'none';
          },
        });
      }

      if (openButtonRef?.current) {
        gsap.to(openButtonRef.current.style, {
          opacity: 1,
          delay: 1.6,
          duration: 0.8,
          onStart: () => {
            if (openButtonRef.current) {
              openButtonRef.current.style.display = 'flex';
              openButtonRef.current.style.pointerEvents = 'none';
            }
          },
          onComplete: () => {
            if (openButtonRef.current) openButtonRef.current.style.pointerEvents = 'auto';
          },
        });
      }
    }
  }, [isOpen]);

  // Method to open notebook
  const handleOpen = (e) => {
    e?.stopPropagation();
    if (!animationsObject?.actions) return;

    const oldAction = animationsObject.actions['Close'];
    if (oldAction) oldAction.stop();

    const action = animationsObject.actions['Open'];
    if (action) {
      action.reset();
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    }

    open();

    if (!isPoweredOn) {
      if (powerOffButtonRef?.current) {
        powerOffButtonRef.current.style.display = 'none';
        powerOffButtonRef.current.style.pointerEvents = 'none';
      }

      if (powerOnButtonRef?.current) {
        gsap.to(powerOnButtonRef.current, {
          opacity: 1,
          delay: 1.8,
          duration: 1,
          display: 'flex',
          ease: 'power1.inOut',
          onComplete: () => {
            if (powerOnButtonRef.current) {
              powerOnButtonRef.current.style.pointerEvents = 'auto';
              powerOnButtonRef.current.style.cursor = 'pointer';
            }
          },
        });
      }
    } else {
      if (screenRef?.current) {
        gsap.to(screenRef.current, {
          onStart: () => {
            screenLightOn(lightRef);
          },
          opacity: 1,
          delay: 1.6,
          duration: 1,
          display: 'block',
        });
      }

      if (powerOnButtonRef?.current) {
        powerOnButtonRef.current.style.display = 'none';
        powerOnButtonRef.current.style.pointerEvents = 'none';
      }

      if (powerOffButtonRef?.current) {
        gsap.to(powerOffButtonRef.current, {
          opacity: 1,
          delay: 1,
          duration: 1,
          display: 'flex',
          ease: 'power1.inOut',
          onComplete: () => {
            if (powerOffButtonRef.current) powerOffButtonRef.current.style.pointerEvents = 'auto';
          },
        });
      }
    }
  };

  // Method to close notebook
  const handleClose = (e) => {
    e?.stopPropagation();
    if (!animationsObject?.actions) return;

    if (powerOnButtonRef?.current) {
      gsap.to(powerOnButtonRef.current, {
        opacity: 0,
        duration: 0.5,
        display: 'none',
        ease: 'power1.inOut',
        onStart: () => {
          if (powerOnButtonRef.current) powerOnButtonRef.current.style.pointerEvents = 'none';
        },
      });
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

    const oldAction = animationsObject.actions['Open'];
    if (oldAction) oldAction.stop();

    const action = animationsObject.actions['Close'];
    if (action) {
      action.reset();
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.setDuration(1.6);
      action.play();
    }

    if (screenRef?.current) {
      gsap.to(screenRef.current, {
        opacity: 0,
        duration: 0.6,
      });
    }

    close();
    screenLightOff(lightRef);
  };

  return (
    <>
      {/* 1. Open Button on the side/hinge */}
      <Html
        transform
        position={[1.42, 0.58, 1]}
        rotation={[-0.3, 0, 0]}
        wrapperClass="pulse"
      >
        <div
          ref={openButtonRef}
          onClick={handleOpen}
          className={`htmlButton pulsing ${isOpen ? 'active' : ''}`}
          style={{ opacity: 0, pointerEvents: 'none', display: 'none' }}
          title="Ouvrir l'ordinateur portable"
        >
          <ChevronUp className="w-3.5 h-3.5 text-amber-300" />
        </div>
      </Html>

      {/* 2. Close Button on the side/hinge */}
      <Html transform position={[1.42, 0.58, 1]} rotation={[-0.3, 0, 0]}>
        <div
          ref={closeButtonRef}
          onClick={handleClose}
          className={`htmlButton ${!isOpen ? 'active' : ''}`}
          style={{ opacity: 0, pointerEvents: 'none', display: 'none' }}
          title="Fermer l'ordinateur portable"
        >
          <ChevronDown className="w-3.5 h-3.5 text-amber-300" />
        </div>
      </Html>
    </>
  );
}
