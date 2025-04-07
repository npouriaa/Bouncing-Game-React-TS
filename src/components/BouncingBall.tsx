import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { System, Box } from "detect-collisions";

type PosType = {
  x: number;
  y: number;
};

const BouncingBall = () => {
  // State to track the position of the ball
  const [ballPos, setBallPos] = useState<PosType>({
    x: 0,
    y: 550, // Initial position of the ball (on the ground)
  });
  
  // State to track the position of the obstacles
  const [boxPos, setBoxPos] = useState<PosType>({ x: -50, y: -60 });
  const [box2Pos, setBox2Pos] = useState<PosType>({ x: 53, y: -60 });

  // Ref to store the ball's velocity (speed of movement)
  const velocityRef = useRef<number>(0);

  // Ref to store the animation frame ID (used to cancel the animation when needed)
  const animationFrameRef = useRef<number | null>(null);

  // Constants for gravity and bounce behavior
  const gravity = 2;
  const bounceFactor = 0.8;
  const groundLevel = 550;

  // Effect to update the ball's position based on gravity and bouncing
  useEffect(() => {
    const updatePosition = () => {
      // Update the ball's position based on its velocity and gravity
      setBallPos((prev) => {
        let newVelocity = velocityRef.current + gravity; // Apply gravity
        let newY = prev.y + newVelocity; // Update position by adding velocity

        // If the ball hits the ground, bounce it
        if (newY >= groundLevel) {
          newY = groundLevel; // Set position to ground level
          newVelocity = -newVelocity * bounceFactor; // Reverse velocity with bounce effect
        }

        velocityRef.current = newVelocity; // Update velocity for the next frame
        return { ...prev, y: newY }; // Return updated position
      });

      // Request the next animation frame to keep updating the position
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    // Only animate if the ball is above the ground
    if (ballPos.y < groundLevel) {
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    }

    // Cleanup function to cancel the animation when the component unmounts or position changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ballPos.y]); // Runs when `ballPos.y` changes

  // Effect to detect collision between the ball and the first obstacle
  useEffect(() => {
    const system = new System();
    const ball = new Box(ballPos, 24, 24); // Create the ball with given position and size
    const box = new Box(boxPos, 100, 3);   // Create the first obstacle (box)

    system.insert(ball); // Insert the ball into the collision system
    system.insert(box);  // Insert the box into the collision system

    // Check if a collision occurs between the ball and the box
    const response = system.checkCollision(ball, box);

    // If a collision is detected, reset the ball's position
    if (response) {
      setBallPos({ y: 500, x: 0 });
      console.log("Collision detected!"); // Log collision
    }
  }, [ballPos.y, boxPos.y]); // Runs when `ballPos.y` or `boxPos.y` changes

  // Effect to animate the obstacles (move left and right)
  useEffect(() => {
    let frameId: number;
    let angle = 0; // Angle for sine wave movement

    // Function to animate the obstacles
    const animateBoxes = () => {
      const amplitude = 70;  // Define how much the obstacles move left-right
      const speed = 0.05;    // Define speed of oscillation

      const center1 = -52;   // Starting position of the first obstacle (box)
      const center2 = 52;    // Starting position of the second obstacle (box2)

      const offset = Math.sin(angle) * amplitude; // Calculate the offset based on sine wave

      // Update the position of the first obstacle (box)
      setBoxPos((prev) => ({ ...prev, x: center1 + offset }));
      // Update the position of the second obstacle (box2)
      setBox2Pos((prev) => ({ ...prev, x: center2 + offset }));

      angle += speed; // Increment the angle to animate the sine wave
      frameId = requestAnimationFrame(animateBoxes); // Request the next animation frame
    };

    frameId = requestAnimationFrame(animateBoxes); // Start the animation loop

    // Cleanup function to cancel the animation when the component unmounts
    return () => cancelAnimationFrame(frameId);
  }, []); // This runs once when the component mounts

  // Function to handle the user tap (bounce the ball upwards)
  const handleTap = () => {
    velocityRef.current = -20; // Apply an upward force to the ball
    setBallPos((prev) => ({ ...prev, y: prev.y - 1 })); // Move the ball slightly up to trigger movement
  };

  return (
    <div className="container" onClick={handleTap}>
      {/* Ball element */}
      <motion.div
        className="ball"
        animate={{
          x: ballPos.x,
          y: ballPos.y,
        }}
      />
      {/* First obstacle */}
      <motion.div
        animate={{
          x: boxPos.x,
          y: 200,
        }}
        className="obstacle"
      />
      {/* Second obstacle */}
      <motion.div
        animate={{
          x: box2Pos.x,
          y: 200,
        }}
        className="obstacle red"
      />
    </div>
  );
};

export default BouncingBall;
