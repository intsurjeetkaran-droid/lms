import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Store, DollarSign, BarChart3, Truck, Settings, Users } from 'lucide-react';

const benefits = [
  {
    icon: Settings,
    title: 'Manage Your Pricing',
    description: 'Set your own prices for each garment type. Full control over your business.'
  },
  {
    icon: DollarSign,
    title: 'Accept/Reject Orders',
    description: 'Review orders before accepting. Set prices for custom items.'
  },
  {
    icon: BarChart3,
    title: 'Track Earnings',
    description: 'Real-time dashboard showing your revenue and order statistics.'
  },
  {
    icon: Truck,
    title: 'GPS Navigation',
    description: 'Navigate directly to customer locations with integrated GPS.'
  },
  {
    icon: Users,
    title: 'Build Your Reputation',
    description: 'Get ratings and reviews. Attract more customers with quality service.'
  },
  {
    icon: Store,
    title: 'Grow Your Business',
    description: 'Reach more customers online. Expand your service area easily.'
  }
];

const ProviderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
              For Service Providers
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Grow Your Laundry Business
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join our platform and reach thousands of customers. Manage everything from one dashboard.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Register as Provider
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProviderSection;
