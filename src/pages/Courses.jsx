import { motion } from 'framer-motion';
import * as LuIcons from 'react-icons/lu';
import SafeIcon from '../common/SafeIcon';

const { LuGraduationCap, LuArrowRight, LuClock, LuTrendingUp } = LuIcons;

const courses = [
  {
    id: 'C_SALES101',
    title: 'Sales 101',
    desc: 'Foundational strategies for high-conversion B2B and B2C engagements. Master the basics of objection handling and closing.',
    level: 'Beginner',
    time: '4 Hours',
    icon: LuTrendingUp
  },
  {
    id: 'C_MODERN',
    title: 'Sales Modernization',
    desc: 'Transitioning legacy sales pipelines into high-velocity digital frameworks. Learn to use automation, CRM synergy, and intent data.',
    level: 'Intermediate',
    time: '6 Hours',
    icon: LuGraduationCap
  },
  {
    id: 'C_PSYCH',
    title: 'Sales Psychology',
    desc: 'Deep dive into cognitive biases, buyer motivation, and emotional intelligence in negotiations and deal structuring.',
    level: 'Advanced',
    time: '8 Hours',
    icon: LuTrendingUp
  },
  {
    id: 'C_AI',
    title: 'Leveraging AI for Sales',
    desc: 'Deploy bespoke AI models to pre-qualify leads, generate outreach copy, and automate follow-ups. Build your automated machine.',
    level: 'Advanced',
    time: '10 Hours',
    icon: LuGraduationCap
  }
];

export default function Courses() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
      <div className="mb-20">
        <span className="section-label">Academy</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-6">AXiM Courses</h1>
        <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed mb-12">
          Technical training, certification, and elite skill acquisition.
          Master modern sales, psychology, and artificial intelligence integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group bg-glass border border-subtle p-8 hover:border-axim-gold/50 cursor-pointer transition-all relative overflow-hidden flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-axim-gold/5 blur-[60px] translate-x-16 -translate-y-16 group-hover:bg-axim-gold/10 transition-colors pointer-events-none" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="p-4 bg-white/5 border border-white/5 rounded-sm text-axim-gold">
                <SafeIcon icon={course.icon} className="w-8 h-8" />
              </div>
              <div className="text-right flex items-center gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-[0.6rem] font-mono uppercase tracking-widest text-zinc-400">
                  {course.level}
                </span>
                <span className="flex items-center gap-1 text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest">
                  <SafeIcon icon={LuClock} className="w-3 h-3" /> {course.time}
                </span>
              </div>
            </div>

            <h3 className="text-3xl font-black uppercase mb-4 relative z-10 group-hover:text-axim-gold transition-colors">{course.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 relative z-10 flex-grow">
              {course.desc}
            </p>

            <button className="w-full py-4 mt-auto border border-axim-gold/30 text-axim-gold font-bold uppercase text-xs tracking-widest group-hover:bg-axim-gold group-hover:text-black transition-colors flex items-center justify-center gap-2 relative z-10">
              Enroll Protocol <SafeIcon icon={LuArrowRight} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
