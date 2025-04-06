import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { System, Box } from "detect-collisions";

type PosType = {
  x: number;
  y: number;
};

const BouncingBall = () => {
  const [ballPos, setBallPos] = useState<PosType>({
    x: 0,
    y: 500,
  });
  const [boxPos] = useState<PosType>({ x: 0, y: -170 });

  const velocityRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const gravity = 2;
  const bounceFactor = 0.8;
  const groundLevel = 500;

  useEffect(() => {
    const updatePosition = () => {
      setBallPos((prev) => {
        let newVelocity = velocityRef.current + gravity;
        let newY = prev.y + newVelocity;

        if (newY >= groundLevel) {
          newY = groundLevel;
          newVelocity = -newVelocity * bounceFactor;
        }

        velocityRef.current = newVelocity;
        return { ...prev, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    if (ballPos.y < groundLevel) {
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ballPos.y]);

  useEffect(() => {
    const system = new System();
    const ball = new Box(ballPos, 24, 24);
    const box = new Box(boxPos, 100, 3);

    system.insert(ball);
    system.insert(box);

    const response = system.checkCollision(ball, box);

    if (response) {
      setBallPos({ y: 500, x: 0 });
      console.log("Collision detected!");
    }
  }, [ballPos.y, boxPos.y]);

  const handleTap = () => {
    velocityRef.current = -20;
    setBallPos((prev) => ({ ...prev, y: prev.y - 1 }));
  };

  return (
    <div className="container" onClick={handleTap}>
      <motion.div
        className="ball"
        animate={{
          x: ballPos.x,
          y: ballPos.y,
        }}
      />
      <motion.div
        animate={{
          x: boxPos.x,
          y: 100,
        }}
        className="obstacle"
      ></motion.div>
    </div>
  );
};

export default BouncingBall;
