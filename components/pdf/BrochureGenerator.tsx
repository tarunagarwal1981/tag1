// components/pdf/BrochureGenerator.tsx
'use client';

import { useState } from 'react';
import { 
  Download, FileText, Mail, MessageSquare, Share2, 
  Printer, Eye, Settings, Palette, Layout, Globe,
  CheckCircle2, Clock, MapPin, Users, DollarSign,
  Star, Calendar, Camera, Phone
} from 'lucide-react';
import { TourPackage } from '@/lib/tourPackageData';
import { cn } from '@/lib/utils';

interface BrochureGeneratorProps {
  package: TourPackage;
  onClose: () => void;
}

export function BrochureGenerator({ package: pkg, onClose }: BrochureGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [includeItinerary, setIncludeItinerary] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [branding, setBranding] = useState({
    companyName: 'Your Tour Company',
    companyLogo: '',
    contactEmail: 'info@yourcompany.com',
    contactPhone: '+1-234-567-8900',
    website: 'www.yourcompany.com'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, business-focused layout',
      preview: 'bg-gradient-to-br from-blue-50 to-white'
    },
    {
      id: 'colorful',
      name: 'Colorful',
      description: 'Vibrant, eye-catching design',
      preview: 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, elegant design',
      preview: 'bg-gradient-to-br from-gray-50 to-white'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'Premium, high-end look',
      preview: 'bg-gradient-to-br from-amber-50 to-white'
    }
  ];

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real app, you would:
    // 1. Send package data to your PDF generation API
    // 2. Get back a PDF URL or blob
    // 3. Trigger download or open in new tab
    
    const blob = new Blob(['Sample PDF content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pkg.title.replace(/[^a-zA-Z0-9]/g, '_')}_brochure.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  const handleQuickShare = (method: 'whatsapp' | 'email' | 'copy') => {
    const shareText = `Check out this amazing tour package: ${pkg.title} - ${pkg.destination} (${pkg.duration} days) starting at $${pkg.pricePerPerson}`;
    
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(pkg.title)}&body=${encodeURIComponent(shareText)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard!');
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate Package Brochure</h2>
            <p className="text-gray-600 mt-1">Create a professional PDF brochure for "{pkg.title}"</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex">
          {/* Settings Panel */}
          <div className="w-1/3 border-r border-gray-200 p-6 space-y-6">
            {/* Template Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      'border-2 rounded-lg p-3 cursor-pointer transition-colors',
                      selectedTemplate === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className={cn('w-full h-16 rounded mb-2', template.preview)}></div>
                    <div className="text-xs font-medium text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Include Content
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeItinerary}
                    onChange={(e) => setIncludeItinerary(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Full Itinerary</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Package Images</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeTerms}
                    onChange={(e) => setIncludeTerms(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Terms & Conditions</span>
                </label>
              </div>
            </div>

            {/* Branding */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Branding
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={branding.contactEmail}
                    onChange={(e) => setBranding({ ...branding, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={branding.contactPhone}
                    onChange={(e) => setBranding({ ...branding, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={branding.website}
                    onChange={(e) => setBranding({ ...branding, website: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </button>

              {/* Quick Share Options */}
              <div className="mt-4">
                <div className="text-xs font-medium text-gray-700 mb-2">Quick Share:</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickShare('whatsapp')}
                    className="flex-1 bg-green-500 text-white py-2 rounded text-xs hover:bg-green-600 flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleQuickShare('email')}
                    className="flex-1 bg-blue-500 text-white py-2 rounded text-xs hover:bg-blue-600 flex items-center justify-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </button>
                  <button
                    onClick={() => handleQuickShare('copy')}
                    className="flex-1 bg-gray-500 text-white py-2 rounded text-xs hover:bg-gray-600 flex items-center justify-center gap-1"
                  >
                    <Share2 className="h-3 w-3" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 p-6">
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Printer className="h-4 w-4" />
                  A4 Size
                </div>
              </div>

              {/* PDF Preview */}
              <div className={cn(
                'bg-white border border-gray-300 rounded-lg shadow-lg p-8 h-full overflow-y-auto',
                selectedTemplate === 'professional' && 'bg-gradient-to-br from-blue-50 to-white',
                selectedTemplate === 'colorful' && 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50',
                selectedTemplate === 'minimal' && 'bg-gradient-to-br from-gray-50 to-white',
                selectedTemplate === 'luxury' && 'bg-gradient-to-br from-amber-50 to-white'
              )}>
                <BrochurePreview 
                  package={pkg}
                  template={selectedTemplate}
                  branding={branding}
                  includeItinerary={includeItinerary}
                  includeImages={includeImages}
                  includeTerms={includeTerms}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Brochure Preview Component
interface BrochurePreviewProps {
  package: TourPackage;
  template: string;
  branding: any;
  includeItinerary: boolean;
  includeImages: boolean;
  includeTerms: boolean;
}

const BrochurePreview: React.FC<BrochurePreviewProps> = ({ 
  package: pkg, 
  template, 
  branding,
  includeItinerary,
  includeImages,
  includeTerms 
}) => {
  const getTemplateColors = () => {
    switch (template) {
      case 'professional': return { primary: 'text-blue-600', accent: 'bg-blue-100', border: 'border-blue-200' };
      case 'colorful': return { primary: 'text-purple-600', accent: 'bg-purple-100', border: 'border-purple-200' };
      case 'minimal': return { primary: 'text-gray-600', accent: 'bg-gray-100', border: 'border-gray-200' };
      case 'luxury': return { primary: 'text-amber-600', accent: 'bg-amber-100', border: 'border-amber-200' };
      default: return { primary: 'text-blue-600', accent: 'bg-blue-100', border: 'border-blue-200' };
    }
  };

  const colors = getTemplateColors();

  return (
    <div className="space-y-6 text-sm">
      {/* Header */}
      <div className="text-center pb-4 border-b">
        <div className={cn('text-2xl font-bold mb-2', colors.primary)}>{branding.companyName}</div>
        <div className="text-gray-600">Presents</div>
      </div>

      {/* Package Title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
        <div className={cn('inline-block px-4 py-2 rounded-full text-sm font-medium', colors.accent, colors.primary)}>
          {pkg.category.charAt(0) + pkg.category.slice(1).toLowerCase()} Tour
        </div>
      </div>

      {/* Key Details */}
      <div className={cn('border rounded-lg p-4', colors.border)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className={cn('h-4 w-4', colors.primary)} />
            <span className="font-medium">Destination:</span>
            <span>{pkg.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className={cn('h-4 w-4', colors.primary)} />
            <span className="font-medium">Duration:</span>
            <span>{pkg.duration} days</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className={cn('h-4 w-4', colors.primary)} />
            <span className="font-medium">Group Size:</span>
            <span>Max {pkg.maxGroupSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className={cn('h-4 w-4', colors.primary)} />
            <span className="font-medium">Price:</span>
            <span className="font-bold">${pkg.pricePerPerson}/person</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className={cn('text-lg font-semibold mb-2', colors.primary)}>About This Tour</h2>
        <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
      </div>

      {/* Highlights */}
      {pkg.highlights && pkg.highlights.length > 0 && (
        <div>
          <h2 className={cn('text-lg font-semibold mb-3', colors.primary)}>Tour Highlights</h2>
          <div className="grid grid-cols-1 gap-2">
            {pkg.highlights.slice(0, 6).map((highlight, index) => (
              <div key={index} className="flex items-start gap-2">
                <Star className={cn('h-4 w-4 mt-0.5 flex-shrink-0', colors.primary)} />
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary Preview */}
      {includeItinerary && pkg.itinerary && pkg.itinerary.length > 0 && (
        <div>
          <h2 className={cn('text-lg font-semibold mb-3', colors.primary)}>Day-by-Day Itinerary</h2>
          <div className="space-y-3">
            {pkg.itinerary.slice(0, 3).map((day, index) => (
              <div key={index} className={cn('border-l-4 pl-4 py-2', colors.border)}>
                <div className="font-semibold text-gray-900">Day {day.day}: {day.title}</div>
                <div className="text-gray-600 text-xs mt-1">{day.description}</div>
                {day.highlights && day.highlights.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-500">{day.highlights[0]}</span>
                  </div>
                )}
              </div>
            ))}
            {pkg.itinerary.length > 3 && (
              <div className="text-center text-gray-500 text-xs">
                ... and {pkg.itinerary.length - 3} more days
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inclusions */}
      {pkg.inclusions && pkg.inclusions.length > 0 && (
        <div>
          <h2 className={cn('text-lg font-semibold mb-3', colors.primary)}>What's Included</h2>
          <div className="grid grid-cols-1 gap-1">
            {pkg.inclusions.slice(0, 6).map((inclusion, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-xs">{inclusion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Placeholder */}
      {includeImages && pkg.images && pkg.images.length > 0 && (
        <div>
          <h2 className={cn('text-lg font-semibold mb-3', colors.primary)}>Gallery</h2>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terms */}
      {includeTerms && (
        <div className="text-xs text-gray-500">
          <h2 className="font-semibold mb-2">Terms & Conditions</h2>
          <p>{pkg.metadata?.cancellationPolicy || 'Standard cancellation policy applies.'}</p>
        </div>
      )}

      {/* Contact Footer */}
      <div className={cn('border-t pt-4 text-center', colors.border)}>
        <div className="font-semibold text-gray-900 mb-2">Ready to Book?</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-3 w-3" />
            {branding.contactEmail}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-3 w-3" />
            {branding.contactPhone}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-3 w-3" />
            {branding.website}
          </div>
        </div>
      </div>
    </div>
  );
};