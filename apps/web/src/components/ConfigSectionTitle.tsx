import { motion } from "framer-motion"

export interface ConfigSectionTitleProps {
  title: string 
  preTitle: string
}

const ConfigSectionTitle = ({ title, preTitle}: ConfigSectionTitleProps) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
      viewport={{ once: true }}
      className="text-lg font-semibold mb-3 flex items-center gap-2"
    >
      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{preTitle}</span>
      {title}
    </motion.h2>
  )
}

export default ConfigSectionTitle