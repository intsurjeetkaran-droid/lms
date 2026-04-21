import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  CheckCircle, 
  CreditCard, 
  Truck, 
  Sparkles,
  ChevronLeft,
  ChevronRight
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

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextStep = () => {
    setIsAutoPlaying(false);
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setIsAutoPlaying(false);
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goToStep = (index) => {
    setIsAutoPlaying(false);
    setCurrentStep(index);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

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

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto">
          {/* Main Carousel Card */}
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.color} opacity-5`} />
            
            {/* Content */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  {/* Step Number */}
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform`}>
                      <Icon size={48} className="text-white md:w-16 md:h-16" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    {currentStepData.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    {currentStepData.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevStep}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-20"
              aria-label="Previous step"
            >
              <ChevronLeft size={24} className="text-slate-700 dark:text-slate-300" />
            </button>

            <button
              onClick={nextStep}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-20"
              aria-label="Next step"
            >
              <ChevronRight size={24} className="text-slate-700 dark:text-slate-300" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentStep
                    ? 'w-12 h-3 bg-gradient-to-r ' + step.color
                    : 'w-3 h-3 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              {isAutoPlaying ? '⏸ Pause' : '▶ Play'} Auto-advance
            </button>
          </div>

          {/* All Steps Overview (Mobile Friendly) */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`p-4 rounded-xl transition-all ${
                    index === currentStep
                      ? 'bg-gradient-to-br ' + step.color + ' shadow-lg scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <StepIcon 
                    size={24} 
                    className={index === currentStep ? 'text-white mx-auto' : 'text-slate-600 dark:text-slate-400 mx-auto'} 
                  />
                  <p className={`text-xs mt-2 font-medium ${
                    index === currentStep 
                      ? 'text-white' 
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {step.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
