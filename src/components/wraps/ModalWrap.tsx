import React, { useContext, useRef, useState } from 'react';
import { Box, Button, Grid, Heading, Layer, ResponsiveContext, Text } from 'grommet';
import styled from 'styled-components';

import { useSpring, animated, to, a } from 'react-spring';
import { useGesture } from 'react-use-gesture';

interface IModalWrap {
  modalOpen: boolean;
  toggleModalOpen: ()=>void;
  children: any;
}

// const BlurredLayer = styled.Layer()`

// `;

const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 200;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 200;

function ModalWrap({ children, toggleModalOpen, modalOpen = false }: IModalWrap) {
  const mobile:boolean = useContext<any>(ResponsiveContext) === 'small';

  const [flipped, setFlipped] = useState(false);

  const domTarget = useRef(null);

  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale, transform, opacity }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: { mass: 5, tension: 500, friction: 80 },
      opacity: flipped ? 1 : 0,
      transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    }),
  );

  useGesture(
    {
      onMove: ({ xy: [px, py], dragging }) => !dragging &&
          api.start({
            rotateX: calcX(py, y.get()),
            rotateY: calcY(px, x.get()),
            scale: 1.00,
          }),
      onHover: ({ hovering }) => !hovering && api.start({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { domTarget, eventOptions: { passive: false } },
  );

  return (
    <Box>
      <animated.div
        ref={domTarget}
        style={{
          transform,
          x,
          y,
          scale: to([scale, zoom], (s, z) => s + z),
          rotateX,
          rotateY,
          rotateZ,
          opacity: opacity.to((o:any) => 1 - o),
        }}
      >
        {
       modalOpen &&
         <Layer
           // plain
           onClickOutside={() => toggleModalOpen()}
           modal
           responsive
         >
           <Box
             height="600px"
             width={mobile ? undefined : '600px'}
             round="small"
             pad="large"
           >
             {children}
           </Box>
         </Layer>
        }
      </animated.div>
    </Box>
  );
}

// ModalWrap.defaultProps = { basis: undefined };
export default ModalWrap;