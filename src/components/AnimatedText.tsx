import { motion } from "motion/react";

const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const words = text.split(' ');
  
  return (
    <div className="flex flex-wrap">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ filter: 'blur(10px)', opacity: 0 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.1,
            ease: "easeOut"
          }}
          className="mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};


export default AnimatedText;