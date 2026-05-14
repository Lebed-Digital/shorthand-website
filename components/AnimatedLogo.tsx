'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LETTERS = ['S','h','o','r','t','H','a','n','d'];
const COLORS  = ['#FF5A5F','#19C37D','#F7A600','#3B82F6','#C084FC','#FF5A5F','#19C37D','#F7A600','#3B82F6'];

export default function AnimatedLogo() {
  return (
    <Link href="/" className="nav-logo" style={{ display: 'flex', letterSpacing: '0.02em', fontFamily: "var(--font-fredoka, sans-serif)", fontWeight: 700 }}>
      {LETTERS.map((letter, i) => (
        <motion.span
          key={i}
          style={{ color: COLORS[i], display: 'inline-block' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
        >
          {letter}
        </motion.span>
      ))}
    </Link>
  );
}
