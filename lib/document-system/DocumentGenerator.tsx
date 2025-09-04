// lib/document-system/DocumentGenerator.tsx
'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Send, 
  Eye, 
  Settings,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Building2,
  Star,
  CheckCircle,
  Clock,
  Printer,
  Share2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { Select } from '@/components/ui/core/Select';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'quote' | 'itinerary' | 'voucher' | 'invoice' | 'contract' | 'brochure';
  description: string;
  thumbnail: string;
  variables: DocumentVariable[];
  isActive: boolean;
  category: 'standard' | 'premium' | 'luxury';
}

export interface DocumentVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'list' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

export interface GeneratedDocument {
  id: string;
  name: string;
  type: DocumentTemplate['type'];
  templateId: string;
  content: string;
  variables: Record<string, any>;
  status: 'draft' | 'final' | 'sent' | 'signed';
  generatedAt: string;
  generatedBy: string;
  size: number;
  downloadUrl: string;
}

// Document Generator Modal
export const DocumentGeneratorModal: React.FC<{
  lead: any;
  onClose: () => void;
  onDocumentGenerated: (document: BookingDocument) => void;
}> = ({ lead, onClose, onDocumentGenerated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [documentVariables, setDocumentVariables] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'quote-standard',
      name: 'Standard Quote',
      type: 'quote',
      description: 'Professional quote with package details and pricing',
      thumbnail: '/templates/quote-standard.jpg',
      category: 'standard',
      isActive: true,
      variables: [
        { key: 'client_name', label: 'Client Name', type: 'text', required: true },
        { key: 'package_name', label: 'Package Name', type: 'text', required: true },
        { key: 'total_cost', label: 'Total Cost', type: 'currency', required: true },
        { key: 'validity_date', label: 'Quote Valid Until', type: 'date', required: true },
        { key: 'inclusions', label: 'Inclusions', type: 'list', required: true },
        { key: 'exclusions', label: 'Exclusions', type: 'list', required: true }
      ]
    },
    {
      id: 'itinerary-detailed',
      name: 'Detailed Itinerary',
      type: 'itinerary',
      description: 'Day-by-day itinerary with activities and accommodations',
      thumbnail: '/templates/itinerary-detailed.jpg',
      category: 'standard',
      isActive: true,
      variables: [
        { key: 'tour_name', label: 'Tour Name', type: 'text', required: true },
        { key: 'duration', label: 'Duration (days)', type: 'number', required: true },
        { key: 'start_date', label: 'Start Date', type: 'date', required: true },
        { key: 'end_date', label: 'End Date', type: 'date', required: true },
        { key: 'destinations', label: 'Destinations', type: 'list', required: true }
      ]
    },
    {
      id: 'voucher-travel',
      name: 'Travel Voucher',
      type: 'voucher',
      description: 'Official travel voucher for confirmed bookings',
      thumbnail: '/templates/voucher-travel.jpg',
      category: 'standard',
      isActive: true,
      variables: [
        { key: 'voucher_number', label: 'Voucher Number', type: 'text', required: true },
        { key: 'booking_reference', label: 'Booking Reference', type: 'text', required: true },
        { key: 'service_details', label: 'Service Details', type: 'text', required: true },
        { key: 'contact_details', label: 'Emergency Contact', type: 'text', required: true }
      ]
    },
    {
      id: 'invoice-standard',
      name: 'Professional Invoice',
      type: 'invoice',
      description: 'Detailed invoice with payment terms',
      thumbnail: '/templates/invoice-standard.jpg',
      category: 'standard',
      isActive: true,
      variables: [
        { key: 'invoice_number', label: 'Invoice Number', type: 'text', required: true },
        { key: 'invoice_date', label: 'Invoice Date', type: 'date', required: true },
        { key: 'due_date', label: 'Due Date', type: 'date', required: true },
        { key: 'services', label: 'Services', type: 'list', required: true },
        { key: 'tax_rate', label: 'Tax Rate (%)', type: 'number', required: false }
      ]
    },
    {
      id: 'contract-booking',
      name: 'Booking Contract',
      type: 'contract',
      description: 'Legal contract with terms and conditions',
      thumbnail: '/templates/contract-booking.jpg',
      category: 'standard',
      isActive: true,
      variables: [
        { key: 'contract_number', label: 'Contract Number', type: 'text', required: true },
        { key: 'signing_date', label: 'Signing Date', type: 'date', required: true },
        { key: 'cancellation_policy', label: 'Cancellation Policy', type: 'text', required: true },
        { key: 'liability_terms', label: 'Liability Terms', type: 'text', required: true }
      ]
    },
    {
      id: 'brochure-premium',
      name: 'Premium Brochure',
      type: 'brochure',
      description: 'Marketing brochure with package highlights',
      thumbnail: '/templates/brochure-premium.jpg',
      category: 'premium',
      isActive: true,
      variables: [
        { key: 'brochure_title', label: 'Brochure Title', type: 'text', required: true },
        { key: 'highlights', label: 'Package Highlights', type: 'list', required: true },
        { key: 'images', label: 'Include Images', type: 'boolean', required: false },
        { key: 'company_branding', label: 'Company Branding', type: 'boolean', required: false }
      ]
    }
  ];

  // Pre-populate variables from lead data
  const populateFromLead = (template: DocumentTemplate) => {
    const populated: Record<string, any> = {};
    
    template.variables.forEach(variable => {
      switch (variable.key) {
        case 'client_name':
          populated[variable.key] = lead.clientName;
          break;
        case 'package_name':
        case 'tour_name':
          populated[variable.key] = lead.destination;
          break;
        case 'total_cost':
          populated[variable.key] = lead.estimatedValue;
          break;
        case 'duration':
          const startDate = new Date(lead.travelDates.from);
          const endDate = new Date(lead.travelDates.to);
          populated[variable.key] = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
          break;
        case 'start_date':
          populated[variable.key] = lead.travelDates.from;
          break;
        case 'end_date':
          populated[variable.key] = lead.travelDates.to;
          break;
        case 'validity_date':
          const validUntil = new Date();
          validUntil.setDate(validUntil.getDate() + 30);
          populated[variable.key] = validUntil.toISOString().split('T')[0];
          break;
        case 'voucher_number':
        case 'booking_reference':
        case 'invoice_number':
        case 'contract_number':
          populated[variable.key] = `${variable.key.toUpperCase().replace('_', '-')}-${Date.now()}`;
          break;
        case 'invoice_date':
        case 'signing_date':
          populated[variable.key] = new Date().toISOString().split('T')[0];
          break;
        case 'due_date':
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 15);
          populated[variable.key] = dueDate.toISOString().split('T')[0];
          break;
        default:
          if (variable.defaultValue !== undefined) {
            populated[variable.key] = variable.defaultValue;
          }
      }
    });

    setDocumentVariables(populated);
  };

  const selectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    populateFromLead(template);
  };

  const generateDocument = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);

    // Simulate document generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const generatedDoc: BookingDocument = {
      id: `doc-${Date.now()}`,
      type: selectedTemplate.type,
      name: `${selectedTemplate.name} - ${lead.clientName}`,
      status: 'draft',
      url: '#generated-document',
      generatedAt: new Date().toISOString()
    };

    onDocumentGenerated(generatedDoc);
    setIsGenerating(false);
  };

  const updateVariable = (key: string, value: any) => {
    setDocumentVariables(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Generate Document</h2>
              <p className="text-gray-600">Create professional documents for {lead.clientName}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Selection */}
            <div className={cn('space-y-4', selectedTemplate && 'lg:col-span-1')}>
              <h3 className="text-lg font-semibold">Choose Template</h3>
              
              <div className="space-y-3">
                {documentTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={cn(
                      'p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300',
                      selectedTemplate?.id === template.id && 'border-blue-500 bg-blue-50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline" size="sm">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration & Preview */}
            {selectedTemplate && (
              <div className="lg:col-span-2 space-y-6">
                {!previewMode ? (
                  <>
                    {/* Variable Configuration */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Configure Details</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewMode(true)}
                            icon={<Eye className="h-4 w-4" />}
                          >
                            Preview
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedTemplate.variables.map((variable) => (
                          <div key={variable.key}>
                            {variable.type === 'text' && (
                              <Input
                                label={variable.label + (variable.required ? ' *' : '')}
                                value={documentVariables[variable.key] || ''}
                                onChange={(e) => updateVariable(variable.key, e.target.value)}
                                placeholder={`Enter ${variable.label.toLowerCase()}`}
                              />
                            )}

                            {variable.type === 'number' && (
                              <Input
                                type="number"
                                label={variable.label + (variable.required ? ' *' : '')}
                                value={documentVariables[variable.key] || ''}
                                onChange={(e) => updateVariable(variable.key, parseFloat(e.target.value))}
                                placeholder={`Enter ${variable.label.toLowerCase()}`}
                              />
                            )}

                            {variable.type === 'currency' && (
                              <Input
                                type="number"
                                label={variable.label + (variable.required ? ' *' : '')}
                                value={documentVariables[variable.key] || ''}
                                onChange={(e) => updateVariable(variable.key, parseFloat(e.target.value))}
                                placeholder="0.00"
                                startIcon={<DollarSign className="h-4 w-4" />}
                              />
                            )}

                            {variable.type === 'date' && (
                              <Input
                                type="date"
                                label={variable.label + (variable.required ? ' *' : '')}
                                value={documentVariables[variable.key] || ''}
                                onChange={(e) => updateVariable(variable.key, e.target.value)}
                              />
                            )}

                            {variable.type === 'list' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {variable.label + (variable.required ? ' *' : '')}
                                </label>
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                  value={Array.isArray(documentVariables[variable.key]) 
                                    ? documentVariables[variable.key].join('\n')
                                    : documentVariables[variable.key] || ''
                                  }
                                  onChange={(e) => updateVariable(variable.key, e.target.value.split('\n'))}
                                  placeholder="Enter each item on a new line"
                                />
                              </div>
                            )}

                            {variable.type === 'boolean' && (
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={variable.key}
                                  checked={documentVariables[variable.key] || false}
                                  onChange={(e) => updateVariable(variable.key, e.target.checked)}
                                  className="rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor={variable.key} className="text-sm font-medium text-gray-700">
                                  {variable.label}
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Document Settings */}
                    <Card className="bg-gray-50">
                      <div className="p-4">
                        <h4 className="font-medium mb-3">Document Settings</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            label="Format"
                            options={[
                              { value: 'pdf', label: 'PDF Document' },
                              { value: 'word', label: 'Word Document' },
                              { value: 'html', label: 'Web Page' }
                            ]}
                            value="pdf"
                          />
                          <Select
                            label="Language"
                            options={[
                              { value: 'en', label: 'English' },
                              { value: 'es', label: 'Spanish' },
                              { value: 'fr', label: 'French' },
                              { value: 'de', label: 'German' }
                            ]}
                            value="en"
                          />
                        </div>
                      </div>
                    </Card>
                  </>
                ) : (
                  /* Document Preview */
                  <DocumentPreview
                    template={selectedTemplate}
                    variables={documentVariables}
                    lead={lead}
                    onBack={() => setPreviewMode(false)}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  {previewMode ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        icon={<Edit className="h-4 w-4" />}
                        onClick={() => setPreviewMode(false)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        onClick={generateDocument}
                        loading={isGenerating}
                        icon={<Download className="h-4 w-4" />}
                      >
                        Generate & Download
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setPreviewMode(true)}
                      icon={<Eye className="h-4 w-4" />}
                    >
                      Preview Document
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Document Preview Component
const DocumentPreview: React.FC<{
  template: DocumentTemplate;
  variables: Record<string, any>;
  lead: any;
  onBack: () => void;
}> = ({ template, variables, lead, onBack }) => {
  const renderDocumentContent = () => {
    switch (template.type) {
      case 'quote':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-900">TRAVEL QUOTE</h1>
              <p className="text-gray-600 mt-2">Professional Travel Services</p>
            </div>

            {/* Quote Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Quote For:</h3>
                <p className="text-gray-700">{variables.client_name}</p>
                <p className="text-gray-600">{lead.clientEmail}</p>
                <p className="text-gray-600">{lead.clientPhone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-lg mb-3">Quote Details:</h3>
                <p className="text-gray-700">Package: {variables.package_name}</p>
                <p className="text-gray-600">Valid Until: {formatDate(new Date(variables.validity_date))}</p>
              </div>
            </div>

            {/* Package Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Package Details:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Destination:</span>
                    <p className="font-medium">{lead.destination}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{variables.duration} days</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Travel Dates:</span>
                    <p className="font-medium">
                      {formatDate(new Date(variables.start_date))} - {formatDate(new Date(variables.end_date))}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Travelers:</span>
                    <p className="font-medium">{lead.travelerCount} persons</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-700">What's Included:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {(variables.inclusions || []).map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-700">What's Not Included:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {(variables.exclusions || []).map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Total Package Cost</h3>
                  <p className="text-gray-600">Per person pricing available</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">
                    {formatCurrency(variables.total_cost)}
                  </div>
                  <p className="text-sm text-gray-600">for {lead.travelerCount} travelers</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'itinerary':
        return (
          <div className="space-y-6">
            <div className="text-center border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-900">{variables.tour_name?.toUpperCase()}</h1>
              <p className="text-xl text-gray-600 mt-2">{variables.duration} Days Detailed Itinerary</p>
            </div>

            {/* Trip Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold">{variables.duration} Days</p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold">{(variables.destinations || []).length} Cities</p>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold">{lead.travelerCount} People</p>
                  <p className="text-sm text-gray-600">Travelers</p>
                </div>
              </div>
            </div>

            {/* Day by Day Itinerary */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Day-by-Day Itinerary:</h3>
              {Array.from({ length: variables.duration || 7 }, (_, index) => (
                <div key={index} className="mb-6 border-l-4 border-blue-500 pl-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h4 className="font-semibold text-lg mb-2">
                      Day {index + 1}: {(variables.destinations || [])[index % (variables.destinations || []).length]}
                    </h4>
                    <p className="text-gray-700 mb-3">
                      Explore the magnificent attractions and immerse yourself in local culture.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Activities:</span>
                        <p>City tour, local market visit, cultural experience</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Meals:</span>
                        <p>Breakfast, Lunch, Dinner</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
            <p className="text-gray-500">
              Preview for {template.name} will be generated with your configured details.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          icon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Edit
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />}>
            Print
          </Button>
          <Button variant="outline" size="sm" icon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
        </div>
      </div>

      {/* Document Preview */}
      <Card className="bg-white">
        <div className="p-8">
          {renderDocumentContent()}
        </div>
      </Card>
    </div>
  );
};

// Document Library Component for managing generated documents
export const DocumentLibrary: React.FC<{
  documents: GeneratedDocument[];
  onDocumentAction: (action: 'download' | 'send' | 'delete', document: GeneratedDocument) => void;
}> = ({ documents, onDocumentAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | DocumentTemplate['type']>('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Library</h2>
          <p className="text-gray-600">Manage all your generated documents</p>
        </div>
        <Button variant="primary" icon={<FileText className="h-4 w-4" />}>
          Generate New Document
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Select
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'quote', label: 'Quotes' },
            { value: 'itinerary', label: 'Itineraries' },
            { value: 'voucher', label: 'Vouchers' },
            { value: 'invoice', label: 'Invoices' },
            { value: 'contract', label: 'Contracts' }
          ]}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <Badge variant="outline" size="sm">
                  {document.type}
                </Badge>
              </div>
              <Badge
                variant={
                  document.status === 'final' ? 'success' :
                  document.status === 'sent' ? 'info' :
                  document.status === 'signed' ? 'success' : 'default'
                }
                size="sm"
              >
                {document.status}
              </Badge>
            </div>

            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{document.name}</h3>
            
            <div className="text-sm text-gray-600 mb-3">
              <p>Generated: {formatDate(new Date(document.generatedAt))}</p>
              <p>Size: {formatFileSize(document.size)}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDocumentAction('download', document)}
                icon={<Download className="h-3 w-3" />}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDocumentAction('send', document)}
                icon={<Send className="h-3 w-3" />}
              >
                Send
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

import { ArrowLeft } from 'lucide-react';