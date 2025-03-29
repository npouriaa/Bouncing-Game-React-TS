import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const BouncingBall = () => {
  // State to track the vertical position of the ball
  const [position, setPosition] = useState<number>(500);

  // State to track whether the ball is squeezed (wider when tapped)
  const [isSqueezed, setIsSqueezed] = useState<boolean>(false);

  // Ref to store the ball's velocity (speed of movement)
  const velocityRef = useRef<number>(0);

  // Ref to store the animation frame ID (used to cancel animation when needed)
  const animationFrameRef = useRef<number | null>(null);

  // Gravity force applied to the ball, increased for faster falling
  const gravity = 2;

  // Bounce factor controls how much energy is retained after bouncing
  const bounceFactor = 0.8;

  useEffect(() => {
    // Function to update the ball's position
    const updatePosition = () => {
      setPosition((prev) => {
        let newVelocity = velocityRef.current + gravity; // Apply gravity to increase downward speed
        let newPos = prev + newVelocity; // Update the ball's position

        // Check if the ball has reached the ground (y = 500)
        if (newPos >= 500) {
          newPos = 500; // Keep the ball at ground level
          newVelocity = -newVelocity * bounceFactor; // Reverse velocity with reduced energy (bounce effect)
        }

        velocityRef.current = newVelocity; // Store the updated velocity for the next frame
        return newPos; // Update the state with the new position
      });

      // Request the next animation frame to keep updating the ball's position
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    // Start the animation loop only if the ball is moving (not at ground level)
    if (position < 500) {
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    }

    // Cleanup function: cancel animation when component unmounts or when position changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position]); // Runs when `position` changes

  // Function to handle user tap event
  const handleTap = () => {
    setIsSqueezed((prev) => !prev); // Toggle the squeezed effect (ball width increases)

    velocityRef.current = -20; // Give the ball an initial upward push
    setPosition((prev) => prev - 1); // Move the ball slightly up to trigger movement

    // Reset the squeezed effect after 300ms (ball returns to normal width)
    setTimeout(() => {
      setIsSqueezed(false);
    }, 300);
  };

  return (
    <div className="container" onClick={handleTap}>
      <motion.div
        className="ball"
        animate={{ y: position, scaleX: isSqueezed ? 1.4 : 1 }} // Squeeze effect when tapped
        transition={{ type: "spring", stiffness: 300, damping: 15 }} // Smooth bounce animation
      />
    </div>
  );
};

export default BouncingBall;
