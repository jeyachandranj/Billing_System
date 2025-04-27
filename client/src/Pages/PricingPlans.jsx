import React from 'react';
import { Card } from "../components/PriceCard";
import { Check, Send, Rocket, Building2 } from "lucide-react";

const PricingPlans = () => {
  const plans = [
    {
      name: 'Basic',
      price: 29,
      icon: <Send className="w-8 h-8 text-blue-500 mb-4" />,
      features: [
        '100 Credits',
        'Basic Support',
        'Monthly Reports'
      ],
      buttonText: 'Choose Basic',
      isPopular: false
    },
    {
      name: 'Pro',
      price: 79,
      icon: <Rocket className="w-8 h-8 text-blue-500 mb-4" />,
      features: [
        '500 Credits',
        'Priority Support',
        'Advanced Analytics',
        'Custom Reports'
      ],
      buttonText: 'Choose Pro',
      isPopular: true
    },
    {
      name: 'Enterprise',
      price: 199,
      icon: <Building2 className="w-8 h-8 text-blue-500 mb-4" />,
      features: [
        '2000 Credits',
        '24/7 Support',
        'White Label Reports',
        'API Access',
        'Dedicated Account Manager'
      ],
      buttonText: 'Choose Enterprise',
      isPopular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">
            Select the perfect subscription plan that suits your needs and unlock premium features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative p-8 ${
                plan.isPopular 
                  ? 'border-2 border-blue-500 shadow-lg' 
                  : 'border border-gray-200 shadow'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                {plan.icon}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="flex justify-center items-baseline mb-8">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="ml-1 text-gray-600">/month</span>
                </div>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 px-6 rounded-lg text-base font-medium transition-colors duration-200 ${
                  plan.isPopular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {plan.buttonText}
              </button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 space-y-2 text-gray-600">
          <p>All plans include automatic monthly renewal. Cancel anytime.</p>
          <p className="flex items-center justify-center">
            <span className="inline-block mr-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
            </span>
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;