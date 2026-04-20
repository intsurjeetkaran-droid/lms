import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { X, Check, TrendingUp } from 'lucide-react';

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const traditional = [
    { text: 'Per kg pricing (confusing)', has: false },
    { text: 'Hidden charges', has: false },
    { text: 'No item tracking', has: false },
    { text: 'Fixed pricing only', has: false },
    { text: 'No transparency', has: false }
  ];

  const ourPlatform = [
    { text: 'Item-based selection', has: true },
    { text: 'Transparent pricing', has: true },
    { text: 'Track each garment', has: true },
    { text: 'Provider-controlled pricing', has: true },
    { text: 'See final cost before payment', has: true }
  ];

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Pricing Logic That Makes Sense
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Say goodbye to confusing per-kg pricing. Welcome to transparent, item-based pricing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional System */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-700"
          >
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <X size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Traditional System
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Old-fashioned approach
              </p>
            </div>

            <ul className="space-y-4">
              {traditional.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Platform */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 rounded-2xl border-2 border-blue-300 dark:border-blue-700 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                RECOMMENDED
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <TrendingUp size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Our Platform
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Modern, transparent approach
              </p>
            </div>

            <ul className="space-y-4">
              {ourPlatform.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Pricing Formula */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="p-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">Transparent Pricing Formula</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 font-mono text-center">
              <div className="text-lg mb-2">Total Price =</div>
              <div className="text-xl font-bold">
                (Item Price × Quantity) + Pickup + Delivery + (Distance × Rate) + Extra
              </div>
            </div>
            <p className="text-center mt-4 text-blue-100">
              Every charge is visible before you confirm your order
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
