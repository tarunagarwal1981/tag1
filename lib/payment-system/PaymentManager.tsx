// lib/payment-system/PaymentManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Send,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { Select } from '@/components/ui/core/Select';
import { cn, formatCurrency } from '@/lib/utils';

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'razorpay' | 'bank_transfer';
  currencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  processingTime: string;
  isActive: boolean;
}

export interface PaymentPlan {
  id: string;
  name: string;
  deposits: {
    percentage: number;
    dueDate: 'immediate' | 'booking_confirmation';
  };
  installments: Array<{
    percentage: number;
    daysFromBooking: number;
    description: string;
  }>;
  finalPayment: {
    percentage: number;
    daysBeforeTravel: number;
  };
}

export interface CommissionTier {
  id: string;
  name: string;
  minBookingValue: number;
  maxBookingValue: number;
  rate: number;
  additionalBenefits: string[];
}

// Payment Processing Modal
export const PaymentProcessingModal: React.FC<{
  payment: PaymentMilestone | undefined;
  onClose: () => void;
  onPaymentProcessed: (payment: PaymentMilestone) => void;
}> = ({ payment, onClose, onPaymentProcessed }) => {
  const [selectedGateway, setSelectedGateway] = useState('stripe');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!payment) return null;

  const paymentGateways: PaymentGateway[] = [
    {
      id: 'stripe',
      name: 'Stripe',
      type: 'stripe',
      currencies: ['USD', 'EUR', 'GBP'],
      fees: { percentage: 2.9, fixed: 0.30 },
      processingTime: 'Instant',
      isActive: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      currencies: ['USD', 'EUR', 'GBP'],
      fees: { percentage: 2.9, fixed: 0.30 },
      processingTime: 'Instant',
      isActive: true
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      type: 'razorpay',
      currencies: ['INR', 'USD'],
      fees: { percentage: 2.0, fixed: 0 },
      processingTime: 'Instant',
      isActive: true
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      currencies: ['USD', 'EUR', 'GBP', 'INR'],
      fees: { percentage: 0, fixed: 25 },
      processingTime: '1-3 business days',
      isActive: true
    }
  ];

  const selectedGatewayInfo = paymentGateways.find(g => g.id === selectedGateway);
  const processingFee = selectedGatewayInfo 
    ? (payment.amount * selectedGatewayInfo.fees.percentage / 100) + selectedGatewayInfo.fees.fixed
    : 0;

  const processPayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const processedPayment: PaymentMilestone = {
      ...payment,
      status: 'completed',
      paymentMethod: selectedGateway,
      transactionId: `TXN-${Date.now()}`,
      paidAt: new Date().toISOString()
    };
    
    onPaymentProcessed(processedPayment);
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Process Payment</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>

          {/* Payment Summary */}
          <Card className="bg-gray-50 mb-6">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Payment Type</div>
                  <div className="font-semibold">
                    {payment.type.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Amount</div>
                  <div className="font-semibold text-lg">
                    {formatCurrency(payment.amount, payment.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Due Date</div>
                  <div className="font-semibold">
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Commission</div>
                  <div className="font-semibold text-green-600">
                    {formatCurrency(payment.commission.agentAmount)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Gateway Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentGateways.map((gateway) => (
                <button
                  key={gateway.id}
                  onClick={() => setSelectedGateway(gateway.id)}
                  className={cn(
                    "p-4 border rounded-lg text-left transition-all",
                    selectedGateway === gateway.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="font-medium">{gateway.name}</div>
                  <div className="text-sm text-gray-600">{gateway.processingTime}</div>
                  <div className="text-sm text-gray-600">
                    Fee: {gateway.fees.percentage}% + {formatCurrency(gateway.fees.fixed)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          {selectedGateway !== 'bank_transfer' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
                <div>
                  <Input
                    label="Expiry Date"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Input
                    label="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Instructions */}
          {selectedGateway === 'bank_transfer' && (
            <Card className="bg-blue-50 mb-6">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Bank Transfer Instructions</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Account Name:</strong> TravelHub Pro Escrow</div>
                  <div><strong>Account Number:</strong> 1234567890</div>
                  <div><strong>Routing Number:</strong> 021000021</div>
                  <div><strong>SWIFT Code:</strong> CHASUS33</div>
                  <div><strong>Reference:</strong> {payment.id}</div>
                </div>
              </div>
            </Card>
          )}

          {/* Fee Breakdown */}
          <Card className="bg-gray-50 mb-6">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Payment Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Amount:</span>
                  <span>{formatCurrency(payment.amount, payment.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>{formatCurrency(processingFee, payment.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(payment.amount + processingFee, payment.currency)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={processPayment}
              loading={processing}
              icon={<CreditCard className="h-4 w-4" />}
            >
              {processing ? 'Processing...' : `Pay ${formatCurrency(payment.amount + processingFee)}`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Commission Dashboard Component
export const CommissionDashboard: React.FC<{
  userRole: 'agent' | 'operator';
  timeframe: 'week' | 'month' | 'quarter' | 'year';
}> = ({ userRole, timeframe }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(timeframe);
  
  // Mock commission data - would come from API
  const commissionData = {
    agent: {
      totalEarned: 45000,
      pending: 12000,
      paid: 33000,
      nextPayout: 8500,
      payoutDate: '2025-09-15',
      bookingsCount: 23,
      averageCommission: 1956,
      topPerformingPackage: 'Golden Triangle Classic'
    },
    operator: {
      totalPaid: 125000,
      pending: 35000,
      agentsCount: 156,
      averageCommission: 15,
      topAgent: 'Emma Thompson',
      monthlyGrowth: 12.5
    }
  };

  const data = commissionData[userRole];

  const commissionTiers: CommissionTier[] = [
    {
      id: 'bronze',
      name: 'Bronze Partner',
      minBookingValue: 0,
      maxBookingValue: 50000,
      rate: 10,
      additionalBenefits: ['Basic support', 'Monthly payouts']
    },
    {
      id: 'silver',
      name: 'Silver Partner', 
      minBookingValue: 50001,
      maxBookingValue: 100000,
      rate: 12,
      additionalBenefits: ['Priority support', 'Bi-weekly payouts', 'Marketing materials']
    },
    {
      id: 'gold',
      name: 'Gold Partner',
      minBookingValue: 100001,
      maxBookingValue: 250000,
      rate: 15,
      additionalBenefits: ['Dedicated support', 'Weekly payouts', 'Custom branding', 'Exclusive packages']
    },
    {
      id: 'platinum',
      name: 'Platinum Partner',
      minBookingValue: 250001,
      maxBookingValue: Infinity,
      rate: 18,
      additionalBenefits: ['24/7 support', 'Instant payouts', 'Co-marketing', 'Custom packages', 'Volume bonuses']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {userRole === 'agent' ? 'Commission Dashboard' : 'Agent Commissions'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'agent' 
              ? 'Track your earnings and payment schedule' 
              : 'Manage agent commission structure and payouts'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' }
            ]}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
          />
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {userRole === 'agent' ? (
          <>
            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                <Badge variant="success" size="sm">+15%</Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(data.totalEarned)}
              </div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(data.pending)}
              </div>
              <div className="text-sm text-gray-600">Pending Payout</div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {new Date(data.payoutDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Next Payout</div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {data.bookingsCount}
              </div>
              <div className="text-sm text-gray-600">Bookings This Month</div>
            </Card>
          </>
        ) : (
          <>
            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-green-500" />
                <Badge variant="info" size="sm">+{data.monthlyGrowth}%</Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(data.totalPaid)}
              </div>
              <div className="text-sm text-gray-600">Total Paid Out</div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(data.pending)}
              </div>
              <div className="text-sm text-gray-600">Pending Payouts</div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {data.agentsCount}
              </div>
              <div className="text-sm text-gray-600">Active Agents</div>
            </Card>

            <Card hover className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {data.averageCommission}%
              </div>
              <div className="text-sm text-gray-600">Avg Commission</div>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Tiers */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Commission Tiers</h3>
            
            <div className="space-y-4">
              {commissionTiers.map((tier, index) => (
                <div
                  key={tier.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    index === 2 && "border-blue-300 bg-blue-50" // Highlight current tier
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-lg">{tier.name}</div>
                    <div className="text-2xl font-bold text-blue-600">{tier.rate}%</div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    {tier.minBookingValue === 0 
                      ? `Up to ${formatCurrency(tier.maxBookingValue)} annual bookings`
                      : tier.maxBookingValue === Infinity
                        ? `${formatCurrency(tier.minBookingValue)}+ annual bookings`
                        : `${formatCurrency(tier.minBookingValue)} - ${formatCurrency(tier.maxBookingValue)} annual bookings`
                    }
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {tier.additionalBenefits.map((benefit, i) => (
                      <Badge key={i} variant="default" size="sm">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Button variant="outline" size="sm" icon={<Eye className="h-4 w-4" />}>
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: '1',
                  booking: 'Golden Triangle - Johnson Family',
                  amount: 1650,
                  status: 'completed',
                  date: '2025-09-03',
                  agent: 'Emma Thompson'
                },
                {
                  id: '2',
                  booking: 'Kerala Backwaters - Mueller Couple',
                  amount: 840,
                  status: 'pending',
                  date: '2025-09-02',
                  agent: 'James Wilson'
                },
                {
                  id: '3',
                  booking: 'Rajasthan Heritage - Garcia Group',
                  amount: 2700,
                  status: 'processing',
                  date: '2025-09-01',
                  agent: 'Maria Rodriguez'
                }
              ].map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {transaction.booking}
                    </div>
                    <div className="text-xs text-gray-600">
                      {userRole === 'operator' ? `Agent: ${transaction.agent}` : `Date: ${transaction.date}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <Badge 
                        variant={
                          transaction.status === 'completed' ? 'success' :
                          transaction.status === 'processing' ? 'info' : 'warning'
                        }
                        size="sm"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Schedule (Agent Only) */}
      {userRole === 'agent' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Payouts</h3>
              <Button variant="outline" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
                Refresh
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-sm font-medium text-gray-600">Booking</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Commission</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Payout Date</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      booking: 'Anderson Family - South India',
                      commission: 1020,
                      payoutDate: '2025-09-15',
                      status: 'scheduled'
                    },
                    {
                      booking: 'Smith Couple - Golden Triangle',
                      commission: 750,
                      payoutDate: '2025-09-30',
                      status: 'pending_confirmation'
                    }
                  ].map((payout, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 text-sm">{payout.booking}</td>
                      <td className="py-3 text-sm font-semibold">
                        {formatCurrency(payout.commission)}
                      </td>
                      <td className="py-3 text-sm">{payout.payoutDate}</td>
                      <td className="py-3">
                        <Badge 
                          variant={payout.status === 'scheduled' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {payout.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Payment Plans Configuration
export const paymentPlans: PaymentPlan[] = [
  {
    id: 'standard',
    name: 'Standard Payment Plan',
    deposits: {
      percentage: 25,
      dueDate: 'booking_confirmation'
    },
    installments: [
      {
        percentage: 50,
        daysFromBooking: 30,
        description: 'Second installment'
      }
    ],
    finalPayment: {
      percentage: 25,
      daysBeforeTravel: 30
    }
  },
  {
    id: 'flexible',
    name: 'Flexible Payment Plan',
    deposits: {
      percentage: 20,
      dueDate: 'immediate'
    },
    installments: [
      {
        percentage: 30,
        daysFromBooking: 15,
        description: 'First installment'
      },
      {
        percentage: 30,
        daysFromBooking: 45,
        description: 'Second installment'
      }
    ],
    finalPayment: {
      percentage: 20,
      daysBeforeTravel: 21
    }
  },
  {
    id: 'full_advance',
    name: 'Full Advance Payment',
    deposits: {
      percentage: 100,
      dueDate: 'booking_confirmation'
    },
    installments: [],
    finalPayment: {
      percentage: 0,
      daysBeforeTravel: 0
    }
  }
];

// Utility functions for payment calculations
export const PaymentCalculator = {
  calculateInstallments: (totalAmount: number, plan: PaymentPlan, bookingDate: Date, travelDate: Date): PaymentMilestone[] => {
    const milestones: PaymentMilestone[] = [];
    
    // Deposit
    const depositDueDate = plan.deposits.dueDate === 'immediate' 
      ? new Date()
      : new Date(bookingDate);
      
    milestones.push({
      id: `deposit-${Date.now()}`,
      type: 'deposit',
      amount: (totalAmount * plan.deposits.percentage) / 100,
      currency: 'USD',
      dueDate: depositDueDate.toISOString(),
      status: 'pending',
      commission: {
        agentRate: 15,
        agentAmount: (totalAmount * plan.deposits.percentage * 0.15) / 100,
        operatorAmount: (totalAmount * plan.deposits.percentage * 0.85) / 100
      }
    });

    // Installments
    plan.installments.forEach((installment, index) => {
      const dueDate = new Date(bookingDate);
      dueDate.setDate(dueDate.getDate() + installment.daysFromBooking);
      
      milestones.push({
        id: `installment-${index}-${Date.now()}`,
        type: 'installment',
        amount: (totalAmount * installment.percentage) / 100,
        currency: 'USD',
        dueDate: dueDate.toISOString(),
        status: 'pending',
        commission: {
          agentRate: 15,
          agentAmount: (totalAmount * installment.percentage * 0.15) / 100,
          operatorAmount: (totalAmount * installment.percentage * 0.85) / 100
        }
      });
    });

    // Final payment
    if (plan.finalPayment.percentage > 0) {
      const finalDueDate = new Date(travelDate);
      finalDueDate.setDate(finalDueDate.getDate() - plan.finalPayment.daysBeforeTravel);
      
      milestones.push({
        id: `final-${Date.now()}`,
        type: 'final_payment',
        amount: (totalAmount * plan.finalPayment.percentage) / 100,
        currency: 'USD',
        dueDate: finalDueDate.toISOString(),
        status: 'pending',
        commission: {
          agentRate: 15,
          agentAmount: (totalAmount * plan.finalPayment.percentage * 0.15) / 100,
          operatorAmount: (totalAmount * plan.finalPayment.percentage * 0.85) / 100
        }
      });
    }

    return milestones;
  },

  calculateCommission: (bookingValue: number, agentTier: CommissionTier): CommissionDetails => {
    const commissionAmount = (bookingValue * agentTier.rate) / 100;
    const taxAmount = commissionAmount * 0.1; // Assuming 10% tax
    const netCommission = commissionAmount - taxAmount;

    return {
      rate: agentTier.rate,
      totalBookingValue: bookingValue,
      commissionAmount,
      taxAmount,
      netCommission,
      payoutStatus: 'pending'
    };
  }
};