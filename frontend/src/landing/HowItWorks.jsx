import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  CheckCircle, 
  CreditCard, 
  Truck, 
  Sparkles 
} from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Select Garments',
    description: 'Browse and choose items from the provider catalog',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: ShoppingCart,
    title: 'Add Custom Items',
    description: 'Add special items not in the list for provider review',
    color: 'from-violet-500 to-purple-500'
  },
  {
    icon: MapPin,
    title: 'Choose Location',
    description: 'Set your pickup location using interactive map',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: CheckCircle,
    title: 'Provider Reviews Price',
    description: 'Provider confirms order and sets final pricing',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: CreditCard,
    title: 'Pay (UPI/COD)',
    description: 'Choose your preferred payment method',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Truck,
    title: 'Pickup → Wash → Deliver',
    description: 'Track your order through every step',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Sparkles,
    title: 'Rate & Review',
    description: 'Share your experience and help others',
    color: 'from-yellow-500 to-amber-500'
  }
];

const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      <div className="flex items-start gap-4">
        {/* Step Number & Icon */}
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
            <Icon size={28} className="text-white" />
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-bold text-slate-400 dark:text-slate-600">
              Step {index + 1}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pt-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {step.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {step.description}
          </p>
        </div>
      </div>

      {/* Connector Line */}
      {index < steps.length - 1 && (
        <div className="absolute left-8 top-20 w-0.5 h-12 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700" />
      )}
    </motion.div>
  );
};

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Simple, transparent, and efficient process from start to finish
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
