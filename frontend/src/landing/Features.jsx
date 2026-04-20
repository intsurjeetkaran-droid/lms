import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Shirt, 
  Plus, 
  DollarSign, 
  MapPin, 
  CreditCard, 
  Activity, 
  MessageSquare, 
  Shield 
} from 'lucide-react';

const features = [
  {
    icon: Shirt,
    title: 'Garment-Based Selection',
    description: 'Choose individual items like shirts, jeans, and jackets. No confusing per-kg pricing.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Plus,
    title: 'Custom Item Support',
    description: 'Add special items not in the catalog. Provider reviews and sets the price.',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: DollarSign,
    title: 'Dynamic Pricing Engine',
    description: 'Transparent pricing with pickup, delivery, and distance charges calculated automatically.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: MapPin,
    title: 'GPS Pickup & Delivery',
    description: 'Set your location on the map. Provider navigates directly to you with GPS.',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: CreditCard,
    title: 'UPI + Cash Payments',
    description: 'Pay via UPI with QR code or choose cash on delivery. Flexible and secure.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Activity,
    title: 'Real-Time Order Tracking',
    description: 'Track your order status from pickup to delivery. Always know where your clothes are.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: MessageSquare,
    title: 'Feedback & Rating System',
    description: 'Rate your experience and help others choose the best service providers.',
    color: 'from-yellow-500 to-amber-500'
  },
  {
    icon: Shield,
    title: 'Complaint Management',
    description: 'Raise complaints if needed. Admin team ensures fair resolution for all issues.',
    color: 'from-cyan-500 to-blue-500'
  }
];

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="h-full p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
          <Icon size={20} className="text-white sm:w-6 sm:h-6" />
        </div>
        
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {feature.title}
        </h3>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 px-4">
            Powerful Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Everything you need for a seamless laundry experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
