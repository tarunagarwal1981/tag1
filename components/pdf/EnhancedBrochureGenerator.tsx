'use client';

import { useState } from 'react';
import { 
  Download, FileText, Mail, MessageSquare, Share2, 
  Printer, Eye, Settings, Palette, Layout, Globe,
  CheckCircle2, Clock, MapPin, Users, DollarSign,
  Star, Calendar, Camera, Phone, X, Sparkles, Building2, Crown, Zap, Shield
} from 'lucide-react';
import { TourPackage } from '@/lib/tourPackageData';
import { cn } from '@/lib/utils';

// Main Brochure Generator Component
interface EnhancedBrochureGeneratorProps {
  package: TourPackage;
  onClose: () => void;
}

export function EnhancedBrochureGenerator({ package: pkg, onClose }: EnhancedBrochureGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [includeItinerary, setIncludeItinerary] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [customBranding, setCustomBranding] = useState({
    companyName: 'Your Tour Company',
    companyLogo: '',
    contactEmail: 'info@yourcompany.com',
    contactPhone: '+1-234-567-8900',
    website: 'www.yourcompany.com',
    address: '123 Travel Street, City, Country'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, business-focused layout',
      preview: 'bg-gradient-to-br from-blue-50 to-white',
      features: ['Clean typography', 'Business colors', 'Structured layout']
    },
    {
      id: 'colorful',
      name: 'Vibrant',
      description: 'Eye-catching, colorful design',
      preview: 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50',
      features: ['Bold colors', 'Dynamic layout', 'Eye-catching design']
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'Premium, high-end look',
      preview: 'bg-gradient-to-br from-amber-50 to-white',
      features: ['Premium feel', 'Elegant typography', 'Sophisticated colors']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean design',
      preview: 'bg-gradient-to-br from-gray-50 to-white',
      features: ['Simple layout', 'Clean lines', 'Focus on content']
    }
  ];

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    // In a real application, you would send data to a PDF generation API here
    // For this prototype, we'll simulate the process and provide a dummy file
    await new Promise(resolve => setTimeout(resolve, 3000));

    const brochureContent = `
${customBranding.companyName}
${'='.repeat(customBranding.companyName.length)}

${pkg.title}
${'-'.repeat(pkg.title.length)}

🌍 DESTINATION: ${pkg.destination}
📅 DURATION: ${pkg.duration} days
👥 GROUP SIZE: Up to ${pkg.maxGroupSize} travelers
💰 PRICE: ${pkg.pricePerPerson} per person
⭐ AGENT COMMISSION: ${pkg.agentCommission}%

📖 DESCRIPTION:
${pkg.description}

✨ PACKAGE HIGHLIGHTS:
${pkg.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

✅ WHAT'S INCLUDED:
${pkg.inclusions.map(i => `• ${i}`).join('\n')}

${includeItinerary && pkg.itinerary.length > 0 ? `
📋 DETAILED ITINERARY:
${pkg.itinerary.map(day => `
Day ${day.day}: ${day.title}
${day.description}
Activities: ${day.activities.join(', ')}
${day.accommodation ? `Accommodation: ${day.accommodation}` : ''}
${day.meals.length > 0 ? `Meals: ${day.meals.join(', ')}` : ''}
`).join('\n')}
` : ''}

${includeTerms ? `
📋 BOOKING INFORMATION:
${pkg.metadata?.cancellationPolicy || 'Standard cancellation policy applies.'}
` : ''}

📞 CONTACT US:
${customBranding.companyName}
📧 ${customBranding.contactEmail}
📞 ${customBranding.contactPhone}
🌐 ${customBranding.website}
📍 ${customBranding.address}

Generated on: ${new Date().toLocaleDateString()}
Template: ${templates.find(t => t.id === selectedTemplate)?.name}
    `;

    const blob = new Blob([brochureContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pkg.title.replace(/[^a-zA-Z0-9]/g, '_')}_brochure_${selectedTemplate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
    onClose();
    alert('✅ Professional brochure downloaded successfully!\n\nIn a real application, this would generate a beautifully formatted PDF with your selected template and branding.');
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
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Package Brochure</h2>
              <p className="text-gray-600 mt-1">Create a professional PDF brochure for "{pkg.title}"</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Settings Panel */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 p-6 space-y-6">
            {/* Template Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Choose Template
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      'border-2 rounded-lg p-4 cursor-pointer transition-all duration-200',
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    )}
                  >
                    <div className={cn('w-full h-16 rounded mb-3', template.preview)}></div>
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{template.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Include Content
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeItinerary}
                    onChange={(e) => setIncludeItinerary(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Full Itinerary</span>
                    <div className="text-xs text-gray-500">Day-by-day activities and details</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Package Images</span>
                    <div className="text-xs text-gray-500">Photo gallery and visuals</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeTerms}
                    onChange={(e) => setIncludeTerms(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Terms & Conditions</span>
                    <div className="text-xs text-gray-500">Booking policies and terms</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Custom Branding */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-green-500" />
                Company Branding
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={customBranding.companyName}
                    onChange={(e) => setCustomBranding({ ...customBranding, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={customBranding.contactEmail}
                    onChange={(e) => setCustomBranding({ ...customBranding, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={customBranding.contactPhone}
                    onChange={(e) => setCustomBranding({ ...customBranding, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1-234-567-8900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={customBranding.website}
                    onChange={(e) => setCustomBranding({ ...customBranding, website: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="www.company.com"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate Professional PDF
                  </>
                )}
              </button>

              {/* Quick Share Options */}
              <div className="mt-4">
                <div className="text-xs font-medium text-gray-700 mb-2">Quick Actions:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickShare('whatsapp')}
                    className="flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    <MessageSquare className="h-3 w-3" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleQuickShare('email')}
                    className="flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded text-xs hover:bg-blue-600 transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 p-6">
            <div className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  A4 Format
                </div>
              </div>

              {/* PDF Preview */}
              <div className={cn(
                'bg-white border-2 border-gray-300 rounded-lg shadow-xl p-8 h-[70vh] lg:h-[80vh] overflow-y-auto transform hover:scale-[1.02] transition-transform duration-200',
                selectedTemplate === 'professional' && 'bg-gradient-to-br from-blue-50 to-white',
                selectedTemplate === 'colorful' && 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50',
                selectedTemplate === 'minimal' && 'bg-gradient-to-br from-gray-50 to-white',
                selectedTemplate === 'luxury' && 'bg-gradient-to-br from-amber-50 to-white'
              )}>
                <BrochurePreview
                  package={pkg}
                  template={selectedTemplate}
                  branding={customBranding}
                  includeItinerary={includeItinerary}
                  includeImages={includeImages}
                  includeTerms={includeTerms}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Additional Info */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Generated in seconds</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Professional quality</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Ready to share worldwide</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Brochure Preview Component
interface BrochurePreviewProps {
  package: TourPackage;
  template: string;
  branding: any;
  includeItinerary: boolean;
  includeImages: boolean;
  includeTerms: boolean;
}

export const BrochurePreview: React.FC<BrochurePreviewProps> = ({
  package: pkg,
  template,
  branding,
  includeItinerary,
  includeImages,
  includeTerms
}) => {
  const getTemplateColors = () => {
    switch (template) {
      case 'professional': return {
        primary: 'text-blue-700',
        accent: 'bg-blue-100',
        border: 'border-blue-200',
        gradient: 'from-blue-600 to-blue-700'
      };
      case 'colorful': return {
        primary: 'text-purple-700',
        accent: 'bg-purple-100',
        border: 'border-purple-200',
        gradient: 'from-purple-600 to-pink-600'
      };
      case 'minimal': return {
        primary: 'text-gray-700',
        accent: 'bg-gray-100',
        border: 'border-gray-200',
        gradient: 'from-gray-600 to-gray-700'
      };
      case 'luxury': return {
        primary: 'text-amber-800',
        accent: 'bg-amber-100',
        border: 'border-amber-200',
        gradient: 'from-amber-600 to-amber-700'
      };
      default: return {
        primary: 'text-blue-700',
        accent: 'bg-blue-100',
        border: 'border-blue-200',
        gradient: 'from-blue-600 to-blue-700'
      };
    }
  };

  const colors = getTemplateColors();

  return (
    <div className="space-y-6 text-sm max-w-4xl">
      {/* Header */}
      <div className="text-center pb-6 border-b-2 border-gray-200">
        <div className={cn('text-3xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent', colors.gradient)}>
          {branding.companyName}
        </div>
        <div className="text-gray-600 italic">Presents</div>
      </div>

      {/* Package Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{pkg.title}</h1>
        <div className={cn('inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold', colors.accent, colors.primary)}>
          <Crown className="h-4 w-4" />
          {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).toLowerCase()} Experience
        </div>
      </div>

      {/* Key Details Grid */}
      <div className={cn('border-2 rounded-xl p-6', colors.border)}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <MapPin className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">{pkg.destination}</div>
            <div className="text-xs text-gray-500">Destination</div>
          </div>
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <Calendar className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">{pkg.duration} Days</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <Users className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">Max {pkg.maxGroupSize}</div>
            <div className="text-xs text-gray-500">Group Size</div>
          </div>
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <DollarSign className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">${pkg.pricePerPerson}</div>
            <div className="text-xs text-gray-500">Per Person</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>About This Experience</h2>
        <p className="text-gray-700 leading-relaxed text-base">{pkg.description}</p>
      </div>

      {/* Highlights */}
      {pkg.highlights && pkg.highlights.length > 0 && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>Experience Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pkg.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Placeholder */}
      {includeImages && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>Photo Gallery</h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary */}
      {includeItinerary && pkg.itinerary && pkg.itinerary.length > 0 && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>Detailed Itinerary</h2>
          <div className="space-y-4">
            {pkg.itinerary.slice(0, 4).map((day, index) => (
              <div key={index} className={cn('border-l-4 pl-6 py-3', colors.border)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r', colors.gradient)}>
                    {day.day}
                  </div>
                  <div className="font-bold text-gray-900">{day.title}</div>
                </div>
                <div className="text-gray-600 mb-2">{day.description}</div>
                {day.highlights && day.highlights.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{day.highlights[0]}</span>
                  </div>
                )}
              </div>
            ))}
            {pkg.itinerary.length > 4 && (
              <div className="text-center text-gray-500 text-sm py-3 border border-gray-200 rounded-lg">
                ... and {pkg.itinerary.length - 4} more exciting days
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inclusions */}
      {pkg.inclusions && pkg.inclusions.length > 0 && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pkg.inclusions.map((inclusion, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{inclusion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terms */}
      {includeTerms && (
        <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-700">Terms & Conditions</h3>
          <p>{pkg.metadata?.cancellationPolicy || 'Standard booking terms and conditions apply. Cancellation policy varies by package.'}</p>
        </div>
      )}

      {/* Contact Footer */}
      <div className={cn('border-t-2 pt-6 text-center', colors.border)}>
        <div className={cn('text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent', colors.gradient)}>
          Ready to Book Your Adventure?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            {branding.contactEmail}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            {branding.contactPhone}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-4 w-4" />
            {branding.website}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Building2 className="h-4 w-4" />
            {branding.address}
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-400">
          Generated by {branding.companyName} • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};