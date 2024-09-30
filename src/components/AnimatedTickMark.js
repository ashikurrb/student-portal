import { motion } from "framer-motion";

const AnimatedTickMark = () => {
  // Variants for the tick mark path animation
  const tickVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  // Variants for the circle fill animation
  const circleFillVariants = {
    hidden: { r: 10, opacity: 0 },
    visible: { r: 47, opacity: 1 }, // Matches stroke's radius
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {/* SVG Container */}
      <motion.svg
        width="170"
        height="170"
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background fill animation */}
        <motion.circle
          cx="50"
          cy="50"
          r="47" // Same as the stroke radius
          fill="#139896" // Fill color for the background
          initial="hidden"
          variants={circleFillVariants}
          animate="visible"
          transition={{ duration: 1, delay: 0.5 }} // Delays fill after stroke starts
        />

        {/* Circle stroke animation */}
        <motion.circle
          cx="50"
          cy="50"
          r="47"
          stroke="#139896"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Tick mark path */}
        <motion.path
          d="M 30 50 L 45 65 L 70 35"
          fill="none"
          stroke="#fff" // White tick to contrast with background fill
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={tickVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.5 }}
        />
      </motion.svg>
    </div>
  );
};

export default AnimatedTickMark;