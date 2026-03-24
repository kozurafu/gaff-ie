'use client';

import { useState } from 'react';

interface VerificationStep {
  id: string;
  label: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
}

interface VerificationFlowProps {
  steps: VerificationStep[];
  onStartVerification: (stepId: string) => void;
}

const STATUS_STYLES = {
  completed: {
    ring: 'border-green-500 bg-green-500',
    icon: '✓',
    iconColor: 'text-white',
    label: 'text-green-700',
    badge: 'bg-green-50 text-green-700',
  },
  current: {
    ring: 'border-gaff-teal bg-white',
    icon: '→',
    iconColor: 'text-gaff-teal',
    label: 'text-gaff-teal',
    badge: 'bg-teal-50 text-gaff-teal',
  },
  pending: {
    ring: 'border-gray-300 bg-white',
    icon: '○',
    iconColor: 'text-gray-400',
    label: 'text-gray-500',
    badge: 'bg-gray-50 text-gray-500',
  },
  rejected: {
    ring: 'border-red-500 bg-red-50',
    icon: '✗',
    iconColor: 'text-red-500',
    label: 'text-red-600',
    badge: 'bg-red-50 text-red-600',
  },
};

export default function VerificationFlow({ steps, onStartVerification }: VerificationFlowProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gaff-slate">Verification Progress</span>
          <span className="text-sm font-bold text-gaff-teal">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gaff-teal rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const styles = STATUS_STYLES[step.status];
          const isExpanded = expandedStep === step.id;
          return (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={`absolute left-5 top-12 w-0.5 h-6 ${step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-white transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${styles.ring} ${styles.iconColor} shrink-0`}>
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${styles.label}`}>{step.label}</p>
                  <p className="text-xs text-gray-500 truncate">{step.description}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge} shrink-0`}>
                  {step.status === 'completed' ? 'Done' : step.status === 'current' ? 'Action needed' : step.status === 'rejected' ? 'Rejected' : 'Pending'}
                </span>
              </button>
              {isExpanded && (step.status === 'current' || step.status === 'rejected') && (
                <div className="ml-14 mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                  <button
                    onClick={() => onStartVerification(step.id)}
                    className="px-4 py-2 bg-gaff-teal text-white text-sm font-medium rounded-lg hover:bg-gaff-teal-dark transition-colors"
                  >
                    {step.status === 'rejected' ? 'Retry Verification' : 'Start Verification'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
