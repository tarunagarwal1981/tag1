'use client';

import { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Plus,
  Trash2,
  Upload,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Camera,
  Star,
  ChevronDown,
  ChevronRight,
  Globe,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourPackage, DayItinerary } from '@/lib/tourPackageData';

interface TourBuilderProps {
  initialPackage?: Partial<TourPackage>;
  onSave: (pkg: TourPackage) => void;
  onCancel: () => void;
}

export function TourBuilder({ initialPackage, onSave, onCancel }: TourBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [packageData, setPackageData] = useState<Partial<TourPackage>>({
    title: '',
    description: '',
    destination: '',
    duration: 7,
    maxGroupSize: 15,
    pricePerPerson: 999,
    agentCommission: 20,
    category: 'CULTURAL',
    difficulty: 'EASY',
    status: 'DRAFT',
    visibility: 'PUBLIC',
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: [],
    images: [],
    metadata: {
      tags: [],
      seoTitle: '',
      seoDescription: '',
      bestTimeToVisit: [],
      weatherInfo: '',
      travelTips: [],
      documentationRequired: [],
      cancellationPolicy: '',
      termsAndConditions: '',
    },
    ...initialPackage,
  });

  const steps = [
    { id: 1, title: 'Basic Info', icon: Info, description: 'Package title, destination, pricing' },
    { id: 2, title: 'Itinerary', icon: Calendar, description: 'Day-by-day planning' },
    { id: 3, title: 'Inclusions', icon: CheckCircle2, description: "What's included & excluded" },
    { id: 4, title: 'Media', icon: Camera, description: 'Photos and descriptions' },
    { id: 5, title: 'Pricing', icon: DollarSign, description: 'Pricing tiers and commissions' },
    { id: 6, title: 'Publish', icon: Globe, description: 'Review and publish' },
  ];

  const updatePackageData = (updates: Partial<TourPackage>) => {
    setPackageData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const newPackage: TourPackage = {
      id: initialPackage?.id || `pkg-${Date.now()}`,
      createdAt: initialPackage?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      lastEditedBy: 'Current User',
      accommodation: [],
      transportation: [],
      meals: [],
      activities: [],
      pricing: [
        {
          name: 'Standard',
          minPax: 2,
          maxPax: packageData.maxGroupSize || 15,
          pricePerPerson: packageData.pricePerPerson || 999,
          validFrom: new Date().toISOString().split('T')[0],
          validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      ],
      availability: [],
      bookings: [],
      reviews: [],
      ...packageData,
    } as TourPackage;
    onSave(newPackage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {initialPackage?.id ? 'Edit Package' : 'Create New Package'}
              </h1>
              <p className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}: {steps.find((s) => s.id === currentStep)?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {currentStep > step.id ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-12 h-0.5 mx-2',
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Step Content */}
          <div className="p-8">
            {currentStep === 1 && <BasicInfoStep data={packageData} onChange={updatePackageData} />}
            {currentStep === 2 && (
              <ItineraryStep data={packageData} onChange={updatePackageData} />
            )}
            {currentStep === 3 && (
              <InclusionsStep data={packageData} onChange={updatePackageData} />
            )}
            {currentStep === 4 && <MediaStep data={packageData} onChange={updatePackageData} />}
            {currentStep === 5 && <PricingStep data={packageData} onChange={updatePackageData} />}
            {currentStep === 6 && <PublishStep data={packageData} onChange={updatePackageData} />}
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 px-8 py-6 flex items-center justify-between">
            <button
              onClick={previousStep}
              disabled={currentStep === 1}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg',
                currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-sm text-gray-500">
              {currentStep} of {steps.length}
            </div>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Publish Package
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Basic Info
interface StepProps {
  data: Partial<TourPackage>;
  onChange: (updates: Partial<TourPackage>) => void;
}

const BasicInfoStep: React.FC<StepProps> = ({ data, onChange }) => {
  const categories = ['CULTURAL', 'ADVENTURE', 'LUXURY', 'BUDGET', 'HONEYMOON', 'FAMILY', 'WILDLIFE'];
  const difficulties = ['EASY', 'MODERATE', 'CHALLENGING'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Basic Information</h2>
        <p className="text-gray-600">Start by providing the essential details about your tour package.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Package Title *</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g., Golden Triangle Classic - Delhi, Agra & Jaipur"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
            placeholder="Provide a compelling description of your tour package..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
          <input
            type="text"
            value={data.destination || ''}
            onChange={(e) => onChange({ destination: e.target.value })}
            placeholder="e.g., Delhi, Agra, Jaipur"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
          <input
            type="number"
            value={data.duration || 7}
            onChange={(e) => onChange({ duration: parseInt(e.target.value) || 7 })}
            min="1"
            max="30"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            value={data.category || 'CULTURAL'}
            onChange={(e) => onChange({ category: e.target.value as any })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level *</label>
          <select
            value={data.difficulty || 'EASY'}
            onChange={(e) => onChange({ difficulty: e.target.value as any })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0) + diff.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Size *</label>
          <input
            type="number"
            value={data.maxGroupSize || 15}
            onChange={(e) => onChange({ maxGroupSize: parseInt(e.target.value) || 15 })}
            min="1"
            max="50"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Price per Person (USD) *
          </label>
          <input
            type="number"
            value={data.pricePerPerson || 999}
            onChange={(e) => onChange({ pricePerPerson: parseInt(e.target.value) || 999 })}
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

// Step 2: Itinerary
const ItineraryStep: React.FC<StepProps> = ({ data, onChange }) => {
  const [itinerary, setItinerary] = useState<DayItinerary[]>(data.itinerary || []);

  const addDay = () => {
    const newDay: DayItinerary = {
      day: itinerary.length + 1,
      title: '',
      description: '',
      activities: [],
      accommodation: '',
      meals: [],
      highlights: [],
    };
    const updated = [...itinerary, newDay];
    setItinerary(updated);
    onChange({ itinerary: updated });
  };

  const updateDay = (dayIndex: number, updates: Partial<DayItinerary>) => {
    const updated = itinerary.map((day, index) =>
      index === dayIndex ? { ...day, ...updates } : day
    );
    setItinerary(updated);
    onChange({ itinerary: updated });
  };

  const removeDay = (dayIndex: number) => {
    const updated = itinerary
      .filter((_, index) => index !== dayIndex)
      .map((day, index) => ({ ...day, day: index + 1 }));
    setItinerary(updated);
    onChange({ itinerary: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tour Itinerary</h2>
          <p className="text-gray-600">Plan your tour day by day with activities and accommodations.</p>
        </div>
        <button
          onClick={addDay}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Day
        </button>
      </div>

      {itinerary.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No itinerary planned yet</h3>
          <p className="text-gray-500 mb-4">Start by adding the first day of your tour</p>
          <button
            onClick={addDay}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add First Day
          </button>
        </div>
      )}

      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <ItineraryDayCard
            key={index}
            day={day}
            onUpdate={(updates) => updateDay(index, updates)}
            onRemove={() => removeDay(index)}
            canRemove={itinerary.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

// Itinerary Day Card Component
interface ItineraryDayCardProps {
  day: DayItinerary;
  onUpdate: (updates: Partial<DayItinerary>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day, onUpdate, onRemove, canRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const addActivity = () => {
    if (newActivity.trim()) {
      onUpdate({ activities: [...day.activities, newActivity.trim()] });
      setNewActivity('');
    }
  };

  const removeActivity = (index: number) => {
    onUpdate({ activities: day.activities.filter((_, i) => i !== index) });
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      onUpdate({ highlights: [...day.highlights, newHighlight.trim()] });
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    onUpdate({ highlights: day.highlights.filter((_, i) => i !== index) });
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="p-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-gray-200 rounded">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <div>
            <h3 className="font-medium text-gray-900">Day {day.day}</h3>
            <p className="text-sm text-gray-500">{day.title || 'Untitled'}</p>
          </div>
        </div>
        {canRemove && (
          <button onClick={onRemove} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Day Title</label>
            <input
              type="text"
              value={day.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="e.g., Arrival in Delhi - Welcome to India"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={day.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={3}
              placeholder="Describe what happens on this day..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation</label>
              <input
                type="text"
                value={day.accommodation}
                onChange={(e) => onUpdate({ accommodation: e.target.value })}
                placeholder="e.g., Hotel Taj Palace, Delhi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meals</label>
              <input
                type="text"
                value={day.meals.join(', ')}
                onChange={(e) =>
                  onUpdate({ meals: e.target.value.split(',').map((m) => m.trim()).filter(Boolean) })
                }
                placeholder="e.g., Breakfast, Lunch, Dinner"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activities</label>
            <div className="space-y-2">
              {day.activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-gray-50 rounded text-sm">{activity}</span>
                  <button
                    onClick={() => removeActivity(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addActivity()}
                  placeholder="Add new activity..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addActivity}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
            <div className="space-y-2">
              {day.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-yellow-50 rounded text-sm">{highlight}</span>
                  <button
                    onClick={() => removeHighlight(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                  placeholder="Add highlight..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addHighlight}
                  className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 3: Inclusions
const InclusionsStep: React.FC<StepProps> = ({ data, onChange }) => {
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const addInclusion = () => {
    if (newInclusion.trim()) {
      onChange({
        inclusions: [...(data.inclusions || []), newInclusion.trim()],
      });
      setNewInclusion('');
    }
  };

  const removeInclusion = (index: number) => {
    onChange({
      inclusions: (data.inclusions || []).filter((_, i) => i !== index),
    });
  };

  const addExclusion = () => {
    if (newExclusion.trim()) {
      onChange({
        exclusions: [...(data.exclusions || []), newExclusion.trim()],
      });
      setNewExclusion('');
    }
  };

  const removeExclusion = (index: number) => {
    onChange({
      exclusions: (data.exclusions || []).filter((_, i) => i !== index),
    });
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      onChange({
        highlights: [...(data.highlights || []), newHighlight.trim()],
      });
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    onChange({
      highlights: (data.highlights || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Inclusions & Highlights</h2>
        <p className="text-gray-600">
          Specify what's included, excluded, and the key highlights of your package.
        </p>
      </div>

      {/* Highlights */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Highlights</h3>
        <div className="space-y-3">
          {(data.highlights || []).map((highlight, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Star className="h-4 w-4 text-yellow-600 flex-shrink-0" />
              <span className="flex-1 text-gray-900">{highlight}</span>
              <button
                onClick={() => removeHighlight(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
              placeholder="Add a highlight (e.g., Visit the iconic Taj Mahal at sunrise)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addHighlight}
              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Inclusions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
        <div className="space-y-3">
          {(data.inclusions || []).map((inclusion, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="flex-1 text-gray-900">{inclusion}</span>
              <button
                onClick={() => removeInclusion(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addInclusion()}
              placeholder="Add inclusion (e.g., 5 nights accommodation in 4-star hotels)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addInclusion}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Exclusions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Not Included</h3>
        <div className="space-y-3">
          {(data.exclusions || []).map((exclusion, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="flex-1 text-gray-900">{exclusion}</span>
              <button
                onClick={() => removeExclusion(index)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
              placeholder="Add exclusion (e.g., International flights)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addExclusion}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Media
const MediaStep: React.FC<StepProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to a cloud service and get URLs
      const newImages = Array.from(files).map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        url: URL.createObjectURL(file), // This is just for demo
        caption: file.name,
        isPrimary: (data.images || []).length === 0 && index === 0,
        order: (data.images || []).length + index + 1,
      }));

      onChange({
        images: [...(data.images || []), ...newImages],
      });
    }
  };

  const removeImage = (imageId: string) => {
    onChange({
      images: (data.images || []).filter((img) => img.id !== imageId),
    });
  };

  const setPrimaryImage = (imageId: string) => {
    onChange({
      images: (data.images || []).map((img) => ({
        ...img,
        isPrimary: img.id === imageId,
      })),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Media & Content</h2>
        <p className="text-gray-600">Add photos and rich content to make your package more appealing.</p>
      </div>

      {/* Image Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Photos</h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Package Photos</h3>
          <p className="text-gray-500 mb-4">Add high-quality images to showcase your tour package</p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <Upload className="h-4 w-4" />
            Choose Photos
          </button>
        </div>

        {/* Image Gallery */}
        {(data.images || []).length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.images!.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Primary
                    </div>
                  )}

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      {!image.isPrimary && (
                        <button
                          onClick={() => setPrimaryImage(image.id)}
                          className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          title="Set as primary"
                        >
                          <Star className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => {
                        onChange({
                          images: (data.images || []).map((img) =>
                            img.id === image.id ? { ...img, caption: e.target.value } : img
                          ),
                        });
                      }}
                      placeholder="Image caption..."
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEO Content */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Marketing</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
            <input
              type="text"
              value={data.metadata?.seoTitle || ''}
              onChange={(e) =>
                onChange({
                  metadata: { ...(data.metadata || {}), seoTitle: e.target.value },
                })
              }
              placeholder="SEO-friendly title for search engines"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
            <textarea
              value={data.metadata?.seoDescription || ''}
              onChange={(e) =>
                onChange({
                  metadata: { ...(data.metadata || {}), seoDescription: e.target.value },
                })
              }
              rows={3}
              placeholder="Brief description for search engine results"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={(data.metadata?.tags || []).join(', ')}
              onChange={(e) =>
                onChange({
                  metadata: {
                    ...(data.metadata || {}),
                    tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean),
                  },
                })
              }
              placeholder="Golden Triangle, Cultural, Heritage, Monuments (comma separated)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 5: Pricing
const PricingStep: React.FC<StepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pricing & Commission</h2>
        <p className="text-gray-600">Set your pricing strategy and agent commission structure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Base Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Base Pricing</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Person (USD)
            </label>
            <input
              type="number"
              value={data.pricePerPerson || 999}
              onChange={(e) => onChange({ pricePerPerson: parseInt(e.target.value) || 999 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Commission (%)</label>
            <input
              type="number"
              value={data.agentCommission || 20}
              onChange={(e) => onChange({ agentCommission: parseInt(e.target.value) || 20 })}
              min="0"
              max="50"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Agent earns $
              {Math.round(((data.pricePerPerson || 999) * (data.agentCommission || 20)) / 100)} per booking
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Group Size</label>
            <input
              type="number"
              value={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pricing Calculator */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price per Person:</span>
              <span className="font-medium">${data.pricePerPerson || 999}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Agent Commission ({data.agentCommission || 20}%):
              </span>
              <span className="font-medium text-blue-600">
                ${Math.round(((data.pricePerPerson || 999) * (data.agentCommission || 20)) / 100)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Your Revenue per Person:</span>
              <span className="font-bold text-green-600">
                $
                {Math.round(
                  (data.pricePerPerson || 999) -
                    ((data.pricePerPerson || 999) * (data.agentCommission || 20)) / 100
                )}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Sample Booking (4 people)</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Total Package Value:</span>
                <span className="font-medium">${(data.pricePerPerson || 999) * 4}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Agent Commission:</span>
                <span className="font-medium">
                  ${Math.round(((data.pricePerPerson || 999) * (data.agentCommission || 20)) / 100) * 4}
                </span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="text-blue-700">Your Revenue:</span>
                <span className="font-bold">
                  $
                  {Math.round(
                    (data.pricePerPerson || 999) -
                      ((data.pricePerPerson || 999) * (data.agentCommission || 20)) / 100
                  ) * 4}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
            <textarea
              value={data.metadata?.cancellationPolicy || ''}
              onChange={(e) =>
                onChange({
                  metadata: { ...(data.metadata || {}), cancellationPolicy: e.target.value },
                })
              }
              rows={3}
              placeholder="e.g., Free cancellation up to 30 days before travel. 50% refund 15-30 days before..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>25% advance, 75% before travel</option>
              <option>50% advance, 50% before travel</option>
              <option>100% advance payment required</option>
              <option>Custom payment terms</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 6: Publish
const PublishStep: React.FC<StepProps> = ({ data, onChange }) => {
  const [isPublishing, setIsPublishing] = useState(false);

  const completionChecks = [
    {
      label: 'Basic Information',
      completed: !!(data.title && data.destination && data.description),
      description: 'Title, destination, and description are required',
    },
    {
      label: 'Itinerary',
      completed: (data.itinerary || []).length > 0,
      description: 'At least one day of itinerary must be planned',
    },
    {
      label: 'Inclusions',
      completed: (data.highlights || []).length > 0 && (data.inclusions || []).length > 0,
      description: 'Package highlights and inclusions are required',
    },
    {
      label: 'Pricing',
      completed: !!(data.pricePerPerson && data.agentCommission),
      description: 'Base price and commission must be set',
    },
  ];

  const canPublish = completionChecks.every((check) => check.completed);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Publish Package</h2>
        <p className="text-gray-600">Review your package and publish it to make it available to agents.</p>
      </div>

      {/* Completion Checklist */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Checklist</h3>
        <div className="space-y-3">
          {completionChecks.map((check, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={cn(
                  'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
                  check.completed ? 'bg-green-500' : 'bg-gray-300'
                )}
              >
                {check.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <div>
                <div
                  className={cn(
                    'font-medium',
                    check.completed ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {check.label}
                </div>
                <div className="text-sm text-gray-500">{check.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Preview */}
      <div className="border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{data.title || 'Package Title'}</h4>
            <p className="text-gray-600 text-sm mb-4">{data.description || 'Package description...'}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{data.destination || 'Destination'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{data.duration || 7} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>Max {data.maxGroupSize || 15} people</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">${data.pricePerPerson || 999}</div>
            <div className="text-sm text-gray-500">per person</div>
            <div className="mt-2 text-sm text-blue-600">
              {data.agentCommission || 20}% agent commission
            </div>
          </div>
        </div>
      </div>

      {/* Publish Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Status</label>
            <select
              value={data.status || 'DRAFT'}
              onChange={(e) => onChange({ status: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DRAFT">Draft - Not visible to agents</option>
              <option value="ACTIVE">Active - Available to all agents</option>
              <option value="INACTIVE">Inactive - Temporarily hidden</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <select
              value={data.visibility || 'PUBLIC'}
              onChange={(e) => onChange({ visibility: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PUBLIC">Public - All agents can see</option>
              <option value="PRIVATE">Private - Only you can see</option>
              <option value="AGENT_SPECIFIC">Agent Specific - Selected agents only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 rounded-xl p-6">
        {canPublish ? (
          <div className="text-center">
            <div className="mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Publish!</h3>
              <p className="text-gray-600">Your package is complete and ready to be published.</p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => onChange({ status: 'DRAFT' })}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Save as Draft
              </button>
              <button
                onClick={() => {
                  setIsPublishing(true);
                  setTimeout(() => {
                    onChange({ status: 'ACTIVE' });
                    setIsPublishing(false);
                  }, 2000);
                }}
                disabled={isPublishing}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isPublishing ? 'Publishing...' : 'Publish Package'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Incomplete</h3>
            <p className="text-gray-600 mb-4">Complete the missing sections above to publish your package.</p>
            <button
              onClick={() => onChange({ status: 'DRAFT' })}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Draft & Continue Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};