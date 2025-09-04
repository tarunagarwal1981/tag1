// lib/booking-system/BookingWorkflowManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CreditCard, 
  FileText, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { cn, formatCurrency } from '@/lib/utils';

// Enhanced Lead interface with payment integration
export interface BookingLead extends Lead {
  bookingProgress: BookingStep[];
  paymentSchedule: PaymentMilestone[];
  documents: BookingDocument[];
  commission: CommissionDetails;
}

export interface BookingStep {
  id: string;
  step: 'lead_qualification' | 'package_selection' | 'customization' | 'quotation' | 'negotiation' | 'booking_confirmation' | 'payment_processing' | 'document_generation' | 'pre_departure';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  deadline: string;
  completedAt?: string;
  notes?: string;
}

export interface PaymentMilestone {
  id: string;
  type: 'deposit' | 'installment' | 'final_payment';
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'completed' | 'overdue' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: string;
  commission: {
    agentRate: number;
    agentAmount: number;
    operatorAmount: number;
  };
}

export interface BookingDocument {
  id: string;
  type: 'quote' | 'itinerary' | 'voucher' | 'invoice' | 'contract' | 'passport_copy' | 'visa_document';
  name: string;
  status: 'draft' | 'sent' | 'approved' | 'signed';
  url: string;
  generatedAt: string;
  approvedAt?: string;
}

export interface CommissionDetails {
  rate: number;
  totalBookingValue: number;
  commissionAmount: number;
  taxAmount: number;
  netCommission: number;
  payoutStatus: 'pending' | 'scheduled' | 'paid';
  payoutDate?: string;
}

// Enhanced Booking Workflow Component
export const BookingWorkflowManager: React.FC<{
  lead: BookingLead;
  onUpdateLead: (lead: BookingLead) => void;
  userRole: 'agent' | 'operator';
}> = ({ lead, onUpdateLead, userRole }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false);

  // Get current booking step
  const currentStep = lead.bookingProgress.find(step => step.status === 'in_progress') 
    || lead.bookingProgress.find(step => step.status === 'pending');

  const completedSteps = lead.bookingProgress.filter(step => step.status === 'completed').length;
  const totalSteps = lead.bookingProgress.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Payment summary
  const totalPaid = lead.paymentSchedule
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalDue = lead.paymentSchedule
    .reduce((sum, payment) => sum + payment.amount, 0);

  const nextPayment = lead.paymentSchedule
    .find(payment => payment.status === 'pending' || payment.status === 'overdue');

  return (
    <div className="space-y-6">
      {/* Booking Progress Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {lead.clientName} - {lead.destination}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant={lead.temperature === 'HOT' ? 'success' : 'default'}>
                  {lead.temperature}
                </Badge>
                <Badge variant="info">
                  {lead.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-gray-600">
                  Booking Value: {formatCurrency(lead.estimatedValue)}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalPaid)}
              </div>
              <div className="text-sm text-gray-600">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalDue - totalPaid)}
              </div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(lead.commission.commissionAmount)}
              </div>
              <div className="text-sm text-gray-600">Commission</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {lead.travelerCount}
              </div>
              <div className="text-sm text-gray-600">Travelers</div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Workflow Steps */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Booking Workflow</h3>
              
              <div className="space-y-4">
                {lead.bookingProgress.map((step, index) => (
                  <WorkflowStep
                    key={step.id}
                    step={step}
                    index={index}
                    isActive={step.status === 'in_progress'}
                    isCompleted={step.status === 'completed'}
                    userRole={userRole}
                    onUpdateStep={(updatedStep) => {
                      const updatedProgress = lead.bookingProgress.map(s => 
                        s.id === updatedStep.id ? updatedStep : s
                      );
                      onUpdateLead({ ...lead, bookingProgress: updatedProgress });
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Payment Schedule */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Payment Schedule</h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowPaymentModal(true)}
                  icon={<CreditCard className="h-4 w-4" />}
                >
                  Process Payment
                </Button>
              </div>

              <div className="space-y-3">
                {lead.paymentSchedule.map((payment) => (
                  <PaymentMilestoneCard
                    key={payment.id}
                    payment={payment}
                    onUpdatePayment={(updatedPayment) => {
                      const updatedSchedule = lead.paymentSchedule.map(p => 
                        p.id === updatedPayment.id ? updatedPayment : p
                      );
                      onUpdateLead({ ...lead, paymentSchedule: updatedSchedule });
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Documents & Communications */}
        <div className="space-y-6">
          {/* Documents */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentGenerator(true)}
                  icon={<FileText className="h-4 w-4" />}
                >
                  Generate
                </Button>
              </div>

              <div className="space-y-3">
                {lead.documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          </Card>

          {/* Communication Hub */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Communication</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<Phone className="h-4 w-4" />}
                >
                  Call {userRole === 'agent' ? 'Client' : 'Agent'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<Mail className="h-4 w-4" />}
                >
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  WhatsApp Message
                </Button>
              </div>
            </div>
          </Card>

          {/* Commission Details (Agent View) */}
          {userRole === 'agent' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Commission Breakdown</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Value:</span>
                    <span className="font-medium">
                      {formatCurrency(lead.commission.totalBookingValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission Rate:</span>
                    <span className="font-medium">{lead.commission.rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Commission:</span>
                    <span className="font-medium">
                      {formatCurrency(lead.commission.commissionAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (if applicable):</span>
                    <span className="font-medium">
                      {formatCurrency(lead.commission.taxAmount)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Net Commission:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(lead.commission.netCommission)}
                      </span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={lead.commission.payoutStatus === 'paid' ? 'success' : 'warning'}
                    className="w-full justify-center mt-3"
                  >
                    Payout {lead.commission.payoutStatus}
                  </Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentProcessingModal
          payment={nextPayment}
          onClose={() => setShowPaymentModal(false)}
          onPaymentProcessed={(payment) => {
            const updatedSchedule = lead.paymentSchedule.map(p => 
              p.id === payment.id ? payment : p
            );
            onUpdateLead({ ...lead, paymentSchedule: updatedSchedule });
            setShowPaymentModal(false);
          }}
        />
      )}

      {/* Document Generator Modal */}
      {showDocumentGenerator && (
        <DocumentGeneratorModal
          lead={lead}
          onClose={() => setShowDocumentGenerator(false)}
          onDocumentGenerated={(document) => {
            onUpdateLead({ 
              ...lead, 
              documents: [...lead.documents, document] 
            });
            setShowDocumentGenerator(false);
          }}
        />
      )}
    </div>
  );
};

// Individual Workflow Step Component
const WorkflowStep: React.FC<{
  step: BookingStep;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  userRole: 'agent' | 'operator';
  onUpdateStep: (step: BookingStep) => void;
}> = ({ step, index, isActive, isCompleted, userRole, onUpdateStep }) => {
  const stepIcons = {
    'lead_qualification': Target,
    'package_selection': MapPin,
    'customization': Users,
    'quotation': FileText,
    'negotiation': MessageSquare,
    'booking_confirmation': CheckCircle,
    'payment_processing': CreditCard,
    'document_generation': FileText,
    'pre_departure': Calendar
  };

  const StepIcon = stepIcons[step.step];

  const markComplete = () => {
    onUpdateStep({
      ...step,
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const isOverdue = new Date(step.deadline) < new Date() && step.status !== 'completed';

  return (
    <div className={cn(
      "flex items-start gap-4 p-4 rounded-lg border transition-all",
      isActive && "border-blue-300 bg-blue-50",
      isCompleted && "border-green-300 bg-green-50",
      isOverdue && "border-red-300 bg-red-50"
    )}>
      {/* Step Icon */}
      <div className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
        isCompleted ? "bg-green-500 text-white" :
        isActive ? "bg-blue-500 text-white" :
        isOverdue ? "bg-red-500 text-white" :
        "bg-gray-300 text-gray-600"
      )}>
        {isCompleted ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <StepIcon className="h-5 w-5" />
        )}
      </div>

      {/* Step Details */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">
            {step.step.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h4>
          <div className="flex items-center gap-2">
            {isOverdue && (
              <Badge variant="danger" size="sm">
                Overdue
              </Badge>
            )}
            <Badge 
              variant={
                step.status === 'completed' ? 'success' :
                step.status === 'in_progress' ? 'info' : 'default'
              } 
              size="sm"
            >
              {step.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <span>Assigned to: {step.assignedTo}</span>
          <span className="ml-4">Due: {new Date(step.deadline).toLocaleDateString()}</span>
        </div>

        {step.notes && (
          <p className="text-sm text-gray-700 mb-3">{step.notes}</p>
        )}

        {/* Action Buttons */}
        {isActive && !isCompleted && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={markComplete}
            >
              Mark Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              Add Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Payment Milestone Card
const PaymentMilestoneCard: React.FC<{
  payment: PaymentMilestone;
  onUpdatePayment: (payment: PaymentMilestone) => void;
}> = ({ payment, onUpdatePayment }) => {
  const isOverdue = new Date(payment.dueDate) < new Date() && payment.status === 'pending';

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border",
      payment.status === 'completed' && "border-green-200 bg-green-50",
      payment.status === 'processing' && "border-blue-200 bg-blue-50",
      isOverdue && "border-red-200 bg-red-50"
    )}>
      <div>
        <div className="font-medium text-gray-900">
          {payment.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        <div className="text-sm text-gray-600">
          Due: {new Date(payment.dueDate).toLocaleDateString()}
        </div>
        {payment.paidAt && (
          <div className="text-sm text-green-600">
            Paid: {new Date(payment.paidAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="text-right">
        <div className="font-semibold">
          {formatCurrency(payment.amount, payment.currency)}
        </div>
        <Badge 
          variant={
            payment.status === 'completed' ? 'success' :
            payment.status === 'processing' ? 'info' :
            isOverdue ? 'danger' : 'default'
          }
          size="sm"
        >
          {payment.status}
        </Badge>
      </div>
    </div>
  );
};

// Document Card
const DocumentCard: React.FC<{ document: BookingDocument }> = ({ document }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-gray-400" />
        <div>
          <div className="font-medium text-gray-900">{document.name}</div>
          <div className="text-sm text-gray-600">
            {new Date(document.generatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge 
          variant={
            document.status === 'signed' ? 'success' :
            document.status === 'approved' ? 'info' :
            document.status === 'sent' ? 'warning' : 'default'
          }
          size="sm"
        >
          {document.status}
        </Badge>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </div>
    </div>
  );
};