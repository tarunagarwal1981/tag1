// lib/tourPackageData.ts
export interface TourPackage {
    id: string;
    title: string;
    description: string;
    destination: string;
    duration: number; // in days
    maxGroupSize: number;
    pricePerPerson: number;
    agentCommission: number; // percentage
    category: 'CULTURAL' | 'ADVENTURE' | 'LUXURY' | 'BUDGET' | 'HONEYMOON' | 'FAMILY' | 'WILDLIFE';
    difficulty: 'EASY' | 'MODERATE' | 'CHALLENGING';
    status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    visibility: 'PUBLIC' | 'PRIVATE' | 'AGENT_SPECIFIC';
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary: DayItinerary[];
    images: PackageImage[];
    accommodation: AccommodationInfo[];
    transportation: TransportationInfo[];
    meals: MealPlan[];
    activities: ActivityInfo[];
    pricing: PricingTier[];
    availability: AvailabilitySlot[];
    bookings: PackageBooking[];
    reviews: PackageReview[];
    metadata: PackageMetadata;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    lastEditedBy: string;
  }
  
  export interface DayItinerary {
    day: number;
    title: string;
    description: string;
    activities: string[];
    accommodation: string;
    meals: string[];
    transportation?: string;
    highlights: string[];
    optionalActivities?: string[];
    estimatedCost?: number;
  }
  
  export interface PackageImage {
    id: string;
    url: string;
    caption: string;
    isPrimary: boolean;
    order: number;
  }
  
  export interface AccommodationInfo {
    name: string;
    type: 'HOTEL' | 'RESORT' | 'GUESTHOUSE' | 'HOMESTAY' | 'CAMP';
    rating: number;
    location: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    amenities: string[];
    images: string[];
  }
  
  export interface TransportationInfo {
    type: 'FLIGHT' | 'TRAIN' | 'BUS' | 'CAR' | 'BOAT';
    from: string;
    to: string;
    duration: string;
    class: string;
    details: string;
  }
  
  export interface MealPlan {
    day: number;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    specialMeals?: string[];
    dietaryOptions: string[];
  }
  
  export interface ActivityInfo {
    id: string;
    name: string;
    type: 'SIGHTSEEING' | 'ADVENTURE' | 'CULTURAL' | 'RELIGIOUS' | 'ENTERTAINMENT';
    duration: string;
    description: string;
    location: string;
    included: boolean;
    cost?: number;
  }
  
  export interface PricingTier {
    name: string;
    minPax: number;
    maxPax: number;
    pricePerPerson: number;
    validFrom: string;
    validTo: string;
  }
  
  export interface AvailabilitySlot {
    id: string;
    startDate: string;
    endDate: string;
    maxCapacity: number;
    bookedCapacity: number;
    status: 'AVAILABLE' | 'LIMITED' | 'SOLD_OUT' | 'BLOCKED';
  }
  
  export interface PackageBooking {
    id: string;
    agentId: string;
    agentName: string;
    clientName: string;
    bookingDate: string;
    travelDate: string;
    paxCount: number;
    totalAmount: number;
    commission: number;
    status: 'INQUIRY' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
  }
  
  export interface PackageReview {
    id: string;
    agentId: string;
    agentName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }
  
  export interface PackageMetadata {
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    bestTimeToVisit: string[];
    weatherInfo: string;
    travelTips: string[];
    documentationRequired: string[];
    cancellationPolicy: string;
    termsAndConditions: string;
  }
  
  // Sample tour packages data
  export const tourPackagesData: TourPackage[] = [
    {
      id: 'pkg-001',
      title: 'Golden Triangle Classic - Delhi, Agra & Jaipur',
      description: 'Experience India\'s most iconic destinations in this carefully crafted 6-day journey through the Golden Triangle. Visit the majestic Taj Mahal, explore the bustling streets of Old Delhi, and immerse yourself in the royal heritage of Jaipur.',
      destination: 'Delhi, Agra, Jaipur',
      duration: 6,
      maxGroupSize: 15,
      pricePerPerson: 899,
      agentCommission: 20,
      category: 'CULTURAL',
      difficulty: 'EASY',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      highlights: [
        'Visit the iconic Taj Mahal at sunrise',
        'Explore the magnificent Red Fort in Delhi',
        'Experience the grandeur of Amber Fort',
        'Shop at colorful local bazaars',
        'Enjoy traditional Rajasthani cuisine'
      ],
      inclusions: [
        '5 nights accommodation in 4-star hotels',
        'All meals (breakfast, lunch, dinner)',
        'Private air-conditioned vehicle',
        'Professional English-speaking guide',
        'All monument entrance fees',
        'Airport transfers'
      ],
      exclusions: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Personal expenses',
        'Tips and gratuities',
        'Optional activities'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Delhi - Welcome to India',
          description: 'Arrive at Delhi airport and transfer to your hotel. Evening at leisure to recover from your journey.',
          activities: ['Airport pickup', 'Hotel check-in', 'Welcome briefing'],
          accommodation: 'Hotel Taj Palace, Delhi',
          meals: ['Dinner'],
          highlights: ['Welcome to the incredible journey through India']
        },
        {
          day: 2,
          title: 'Delhi City Tour - Old & New Delhi',
          description: 'Full day exploring both Old and New Delhi, visiting iconic monuments and bustling markets.',
          activities: [
            'Red Fort exploration',
            'Jama Masjid visit',
            'Rickshaw ride in Chandni Chowk',
            'India Gate photo stop',
            'Parliament House drive-by',
            'Qutub Minar visit'
          ],
          accommodation: 'Hotel Taj Palace, Delhi',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          highlights: [
            'Experience the contrast between Old and New Delhi',
            'Taste authentic street food in Chandni Chowk'
          ]
        },
        {
          day: 3,
          title: 'Delhi to Agra - City of Love',
          description: 'Drive to Agra (4 hours). Visit Agra Fort and enjoy sunset views of the Taj Mahal from Mehtab Bagh.',
          activities: [
            'Drive to Agra',
            'Check into hotel',
            'Visit Agra Fort',
            'Sunset view at Mehtab Bagh'
          ],
          accommodation: 'Hotel Taj View, Agra',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          highlights: ['First glimpse of the majestic Taj Mahal']
        },
        {
          day: 4,
          title: 'Taj Mahal Sunrise & Drive to Jaipur',
          description: 'Early morning visit to the Taj Mahal for sunrise. Later drive to the Pink City of Jaipur.',
          activities: [
            'Sunrise at Taj Mahal',
            'Breakfast at hotel',
            'Drive to Jaipur (5 hours)',
            'Check into heritage hotel'
          ],
          accommodation: 'Hotel Umaid Bhawan, Jaipur',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          highlights: ['Witness the magical beauty of Taj Mahal at sunrise']
        },
        {
          day: 5,
          title: 'Jaipur - The Pink City',
          description: 'Full day exploring Jaipur\'s magnificent forts, palaces, and vibrant markets.',
          activities: [
            'Amber Fort with elephant ride',
            'City Palace complex visit',
            'Hawa Mahal photo stop',
            'Jantar Mantar observatory',
            'Local bazaar shopping'
          ],
          accommodation: 'Hotel Umaid Bhawan, Jaipur',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          highlights: [
            'Royal elephant ride at Amber Fort',
            'Shop for traditional Rajasthani handicrafts'
          ]
        },
        {
          day: 6,
          title: 'Jaipur to Delhi Departure',
          description: 'Drive back to Delhi and transfer to airport for departure.',
          activities: [
            'Check out from hotel',
            'Drive to Delhi (5 hours)',
            'Airport transfer',
            'Departure'
          ],
          accommodation: '',
          meals: ['Breakfast'],
          highlights: ['Farewell to incredible India']
        }
      ],
      images: [
        {
          id: 'img-001',
          url: '/images/packages/golden-triangle-1.jpg',
          caption: 'Taj Mahal at sunrise',
          isPrimary: true,
          order: 1
        },
        {
          id: 'img-002',
          url: '/images/packages/golden-triangle-2.jpg',
          caption: 'Red Fort, Delhi',
          isPrimary: false,
          order: 2
        },
        {
          id: 'img-003',
          url: '/images/packages/golden-triangle-3.jpg',
          caption: 'Amber Fort, Jaipur',
          isPrimary: false,
          order: 3
        }
      ],
      accommodation: [
        {
          name: 'Hotel Taj Palace',
          type: 'HOTEL',
          rating: 4.5,
          location: 'Delhi',
          checkIn: 'Day 1',
          checkOut: 'Day 3',
          roomType: 'Deluxe Room',
          amenities: ['Wi-Fi', 'Restaurant', 'Spa', 'Pool', 'Room Service'],
          images: ['/images/hotels/taj-palace-delhi.jpg']
        },
        {
          name: 'Hotel Taj View',
          type: 'HOTEL',
          rating: 4.2,
          location: 'Agra',
          checkIn: 'Day 3',
          checkOut: 'Day 4',
          roomType: 'Taj Facing Room',
          amenities: ['Wi-Fi', 'Restaurant', 'Taj View', 'Room Service'],
          images: ['/images/hotels/taj-view-agra.jpg']
        },
        {
          name: 'Hotel Umaid Bhawan',
          type: 'HOTEL',
          rating: 4.3,
          location: 'Jaipur',
          checkIn: 'Day 4',
          checkOut: 'Day 6',
          roomType: 'Heritage Room',
          amenities: ['Wi-Fi', 'Restaurant', 'Heritage Architecture', 'Pool'],
          images: ['/images/hotels/umaid-bhawan-jaipur.jpg']
        }
      ],
      transportation: [
        {
          type: 'CAR',
          from: 'Delhi',
          to: 'Agra',
          duration: '4 hours',
          class: 'AC Private Vehicle',
          details: 'Toyota Innova or similar with professional driver'
        },
        {
          type: 'CAR',
          from: 'Agra',
          to: 'Jaipur',
          duration: '5 hours',
          class: 'AC Private Vehicle',
          details: 'Toyota Innova or similar with professional driver'
        },
        {
          type: 'CAR',
          from: 'Jaipur',
          to: 'Delhi',
          duration: '5 hours',
          class: 'AC Private Vehicle',
          details: 'Toyota Innova or similar with professional driver'
        }
      ],
      meals: [
        { day: 1, breakfast: false, lunch: false, dinner: true, dietaryOptions: ['Vegetarian', 'Non-Vegetarian'] },
        { day: 2, breakfast: true, lunch: true, dinner: true, dietaryOptions: ['Vegetarian', 'Non-Vegetarian'] },
        { day: 3, breakfast: true, lunch: true, dinner: true, dietaryOptions: ['Vegetarian', 'Non-Vegetarian'] },
        { day: 4, breakfast: true, lunch: true, dinner: true, dietaryOptions: ['Vegetarian', 'Non-Vegetarian'] },
        { day: 5, breakfast: true, lunch: true, dinner: true, dietaryOptions: ['Vegetarian', 'Non-Vegetarian'] },
        { day: 6, breakfast: true, lunch: false, dinner: false, dietaryOptions: ['Vegetarian', 'Non-Vegetarian'] }
      ],
      activities: [
        {
          id: 'act-001',
          name: 'Elephant Ride at Amber Fort',
          type: 'ADVENTURE',
          duration: '30 minutes',
          description: 'Traditional elephant ride up to Amber Fort',
          location: 'Amber Fort, Jaipur',
          included: true
        },
        {
          id: 'act-002',
          name: 'Rickshaw Ride in Chandni Chowk',
          type: 'CULTURAL',
          duration: '45 minutes',
          description: 'Experience the bustling streets of Old Delhi',
          location: 'Chandni Chowk, Delhi',
          included: true
        }
      ],
      pricing: [
        {
          name: 'Standard',
          minPax: 2,
          maxPax: 4,
          pricePerPerson: 899,
          validFrom: '2025-01-01',
          validTo: '2025-12-31'
        },
        {
          name: 'Group Discount',
          minPax: 5,
          maxPax: 15,
          pricePerPerson: 799,
          validFrom: '2025-01-01',
          validTo: '2025-12-31'
        }
      ],
      availability: [
        {
          id: 'slot-001',
          startDate: '2025-01-15',
          endDate: '2025-01-20',
          maxCapacity: 15,
          bookedCapacity: 8,
          status: 'AVAILABLE'
        },
        {
          id: 'slot-002',
          startDate: '2025-02-01',
          endDate: '2025-02-06',
          maxCapacity: 15,
          bookedCapacity: 12,
          status: 'LIMITED'
        }
      ],
      bookings: [
        {
          id: 'booking-001',
          agentId: 'agent-123',
          agentName: 'Sarah Johnson - London Travel Co',
          clientName: 'Mr. & Mrs. Smith',
          bookingDate: '2024-12-15',
          travelDate: '2025-01-15',
          paxCount: 2,
          totalAmount: 1798,
          commission: 359.60,
          status: 'CONFIRMED'
        }
      ],
      reviews: [
        {
          id: 'review-001',
          agentId: 'agent-123',
          agentName: 'Sarah Johnson',
          rating: 4.8,
          comment: 'Excellent package! My clients were thrilled with the experience.',
          date: '2024-11-20',
          verified: true
        }
      ],
      metadata: {
        tags: ['Golden Triangle', 'Cultural', 'First Time India', 'Monuments', 'Heritage'],
        seoTitle: 'Golden Triangle Tour - Delhi Agra Jaipur 6 Days',
        seoDescription: 'Explore India\'s Golden Triangle with our 6-day tour covering Delhi, Agra, and Jaipur.',
        bestTimeToVisit: ['October-March', 'Cool weather', 'Clear skies'],
        weatherInfo: 'Pleasant weather during winter months (Oct-Mar). Summer can be hot.',
        travelTips: [
          'Carry comfortable walking shoes',
          'Respect local customs at religious sites',
          'Stay hydrated',
          'Keep copies of important documents'
        ],
        documentationRequired: [
          'Valid passport',
          'Indian tourist visa',
          'Travel insurance (recommended)'
        ],
        cancellationPolicy: 'Free cancellation up to 30 days before travel. 50% refund 15-30 days before. No refund within 15 days.',
        termsAndConditions: 'Standard booking terms apply. See full terms on website.'
      },
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-12-01T15:30:00Z',
      createdBy: 'Raj Kumar',
      lastEditedBy: 'Priya Sharma'
    },
    {
      id: 'pkg-002',
      title: 'Kerala Backwaters & Hills - Nature\'s Paradise',
      description: 'Discover the serene backwaters, lush tea plantations, and exotic wildlife of Kerala in this 8-day journey through God\'s Own Country.',
      destination: 'Cochin, Munnar, Thekkady, Alleppey',
      duration: 8,
      maxGroupSize: 12,
      pricePerPerson: 1299,
      agentCommission: 22,
      category: 'LUXURY',
      difficulty: 'EASY',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      highlights: [
        'Stay in a luxury houseboat on backwaters',
        'Tea plantation tours in Munnar',
        'Wildlife safari in Periyar National Park',
        'Ayurvedic spa treatments',
        'Traditional Kerala cuisine cooking class'
      ],
      inclusions: [
        '7 nights accommodation (luxury hotels & houseboat)',
        'All meals with Kerala specialties',
        'Private air-conditioned vehicle',
        'Professional naturalist guide',
        'Boat rides and safaris',
        'Airport transfers',
        'Ayurvedic spa session'
      ],
      exclusions: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Personal expenses',
        'Optional activities',
        'Alcoholic beverages'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Cochin',
          description: 'Welcome to Kerala! Transfer to hotel and explore Fort Cochin.',
          activities: ['Airport pickup', 'Hotel check-in', 'Chinese fishing nets', 'St. Francis Church'],
          accommodation: 'Taj Malabar Resort, Cochin',
          meals: ['Dinner'],
          highlights: ['Historic Fort Cochin exploration']
        },
        {
          day: 2,
          title: 'Cochin to Munnar - Hill Station',
          description: 'Drive to Munnar through scenic Western Ghats. Check into hillside resort.',
          activities: ['Scenic drive to Munnar', 'Check into resort', 'Tea estate visit'],
          accommodation: 'Windermere Estate, Munnar',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          highlights: ['Breathtaking mountain views and tea gardens']
        }
        // More days would continue...
      ],
      images: [
        {
          id: 'img-kerala-1',
          url: '/images/packages/kerala-1.jpg',
          caption: 'Kerala backwaters houseboat',
          isPrimary: true,
          order: 1
        }
      ],
      accommodation: [],
      transportation: [],
      meals: [],
      activities: [],
      pricing: [
        {
          name: 'Luxury',
          minPax: 2,
          maxPax: 4,
          pricePerPerson: 1299,
          validFrom: '2025-01-01',
          validTo: '2025-12-31'
        }
      ],
      availability: [],
      bookings: [],
      reviews: [],
      metadata: {
        tags: ['Kerala', 'Backwaters', 'Hills', 'Luxury', 'Nature'],
        seoTitle: 'Kerala Backwaters and Hills Tour 8 Days',
        seoDescription: 'Experience Kerala\'s natural beauty with our luxury 8-day tour.',
        bestTimeToVisit: ['September-March'],
        weatherInfo: 'Pleasant weather during winter months.',
        travelTips: ['Pack light cotton clothes', 'Mosquito repellent recommended'],
        documentationRequired: ['Valid passport', 'Indian tourist visa'],
        cancellationPolicy: 'Free cancellation up to 30 days before travel.',
        termsAndConditions: 'Standard terms apply.'
      },
      createdAt: '2024-11-15T10:00:00Z',
      updatedAt: '2024-12-01T15:30:00Z',
      createdBy: 'Anjali Nair',
      lastEditedBy: 'Raj Kumar'
    },
    {
      id: 'pkg-003',
      title: 'Rajasthan Royal Heritage - Palaces & Forts',
      description: 'Journey through the land of kings with visits to magnificent palaces, imposing forts, and vibrant markets across Rajasthan.',
      destination: 'Jaipur, Jodhpur, Udaipur, Jaisalmer',
      duration: 10,
      maxGroupSize: 20,
      pricePerPerson: 1599,
      agentCommission: 18,
      category: 'CULTURAL',
      difficulty: 'MODERATE',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      highlights: [
        'Stay in heritage palace hotels',
        'Camel safari in Thar Desert',
        'Sunset boat ride on Lake Pichola',
        'Traditional Rajasthani folk performances',
        'Visit to local artisan workshops'
      ],
      inclusions: [
        '9 nights in heritage and luxury hotels',
        'All meals with Rajasthani cuisine',
        'Private air-conditioned vehicle',
        'Expert heritage guide',
        'All entrance fees and activities',
        'Camel safari with overnight camping',
        'Traditional performances'
      ],
      exclusions: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Personal shopping',
        'Tips and gratuities',
        'Optional helicopter ride'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Jaipur - The Pink City',
          description: 'Arrive in Jaipur and check into heritage hotel.',
          activities: ['Airport pickup', 'Heritage hotel check-in', 'Welcome dinner with folk show'],
          accommodation: 'Rambagh Palace, Jaipur',
          meals: ['Dinner'],
          highlights: ['Royal welcome at palace hotel']
        }
        // More days would continue...
      ],
      images: [
        {
          id: 'img-rajasthan-1',
          url: '/images/packages/rajasthan-1.jpg',
          caption: 'Udaipur City Palace',
          isPrimary: true,
          order: 1
        }
      ],
      accommodation: [],
      transportation: [],
      meals: [],
      activities: [],
      pricing: [
        {
          name: 'Heritage',
          minPax: 2,
          maxPax: 6,
          pricePerPerson: 1599,
          validFrom: '2025-01-01',
          validTo: '2025-12-31'
        }
      ],
      availability: [],
      bookings: [],
      reviews: [],
      metadata: {
        tags: ['Rajasthan', 'Heritage', 'Palaces', 'Cultural', 'Desert'],
        seoTitle: 'Rajasthan Royal Heritage Tour 10 Days',
        seoDescription: 'Explore royal palaces and forts of Rajasthan.',
        bestTimeToVisit: ['October-March'],
        weatherInfo: 'Best in winter months, can be very hot in summer.',
        travelTips: ['Respect royal heritage sites', 'Bargain at markets'],
        documentationRequired: ['Valid passport', 'Indian tourist visa'],
        cancellationPolicy: 'Varies by accommodation booked.',
        termsAndConditions: 'Heritage property terms apply.'
      },
      createdAt: '2024-10-01T10:00:00Z',
      updatedAt: '2024-11-20T15:30:00Z',
      createdBy: 'Vikram Singh',
      lastEditedBy: 'Raj Kumar'
    },
    {
      id: 'pkg-004',
      title: 'Himalayan Adventure - Trekking & Spirituality',
      description: 'Combine adventure trekking with spiritual experiences in the majestic Himalayas.',
      destination: 'Rishikesh, Haridwar, Mussoorie, Dehradun',
      duration: 7,
      maxGroupSize: 8,
      pricePerPerson: 999,
      agentCommission: 25,
      category: 'ADVENTURE',
      difficulty: 'CHALLENGING',
      status: 'ACTIVE',
      visibility: 'PUBLIC',
      highlights: [
        'White water rafting on Ganges',
        'Yoga and meditation sessions',
        'Trek to Kempty Falls',
        'Attend evening Ganga Aarti',
        'Adventure activities in Mussoorie'
      ],
      inclusions: [
        '6 nights accommodation (camps & hotels)',
        'All meals including trek meals',
        'Professional trekking guide',
        'All adventure activities',
        'Safety equipment',
        'Transportation for entire trip'
      ],
      exclusions: [
        'Personal trekking gear',
        'Insurance for adventure activities',
        'Personal expenses',
        'Tips for guides and porters',
        'Helicopter rescue insurance'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Rishikesh',
          description: 'Arrive and acclimatize. Evening Ganga Aarti ceremony.',
          activities: ['Check into ashram', 'Orientation', 'Ganga Aarti ceremony'],
          accommodation: 'Parmarth Niketan Ashram',
          meals: ['Lunch', 'Dinner'],
          highlights: ['Spiritual introduction to the Himalayas']
        }
        // More days would continue...
      ],
      images: [
        {
          id: 'img-himalaya-1',
          url: '/images/packages/himalaya-1.jpg',
          caption: 'Rishikesh Ganga Aarti',
          isPrimary: true,
          order: 1
        }
      ],
      accommodation: [],
      transportation: [],
      meals: [],
      activities: [],
      pricing: [
        {
          name: 'Adventure',
          minPax: 4,
          maxPax: 8,
          pricePerPerson: 999,
          validFrom: '2025-03-01',
          validTo: '2025-06-30'
        }
      ],
      availability: [],
      bookings: [],
      reviews: [],
      metadata: {
        tags: ['Himalaya', 'Adventure', 'Trekking', 'Spiritual', 'Rafting'],
        seoTitle: 'Himalayan Adventure Trek 7 Days',
        seoDescription: 'Adventure and spirituality in the Himalayas.',
        bestTimeToVisit: ['March-June', 'September-November'],
        weatherInfo: 'Pleasant in spring and autumn, cold in winter.',
        travelTips: ['Good fitness required', 'Pack warm clothes'],
        documentationRequired: ['Valid passport', 'Fitness certificate'],
        cancellationPolicy: 'Adventure activity terms apply.',
        termsAndConditions: 'Liability waiver required.'
      },
      createdAt: '2024-09-15T10:00:00Z',
      updatedAt: '2024-11-01T15:30:00Z',
      createdBy: 'Arjun Patel',
      lastEditedBy: 'Vikram Singh'
    }
  ];
  
  // Helper functions
  export const getPackagesByCategory = (category: TourPackage['category']) => 
    tourPackagesData.filter(pkg => pkg.category === category);
  
  export const getActivePackages = () => 
    tourPackagesData.filter(pkg => pkg.status === 'ACTIVE');
  
  export const getPackageById = (id: string) => 
    tourPackagesData.find(pkg => pkg.id === id);
  
  export const calculateTotalRevenue = (packages: TourPackage[]) => 
    packages.reduce((total, pkg) => 
      total + pkg.bookings.reduce((pkgTotal, booking) => 
        pkgTotal + (booking.status === 'CONFIRMED' ? booking.totalAmount : 0), 0
      ), 0
    );
  
  export const getTopPerformingPackages = (limit: number = 5) => 
    [...tourPackagesData]
      .sort((a, b) => b.bookings.length - a.bookings.length)
      .slice(0, limit);
  
  export const getPackageStats = () => {
    const total = tourPackagesData.length;
    const active = tourPackagesData.filter(p => p.status === 'ACTIVE').length;
    const draft = tourPackagesData.filter(p => p.status === 'DRAFT').length;
    const totalRevenue = calculateTotalRevenue(tourPackagesData);
    const totalBookings = tourPackagesData.reduce((sum, pkg) => sum + pkg.bookings.length, 0);
    
    return { total, active, draft, totalRevenue, totalBookings };
  };