// AI Tools - Simulating real backend API calls
// In production, these would call actual backend endpoints

// Mock user session data (in real app, from auth context)
const mockUserSession = {
  userId: 'USR_12345',
  name: 'Anvesha',
  phone: '+91-98765-43210',
  currentLocation: { lat: 26.9124, lng: 75.7873, address: 'Malviya Nagar, Jaipur' },
  activeRide: null,
  recentRides: [
    {
      rideId: 'RIDE_001',
      date: '2026-08-01',
      from: 'Malviya Nagar',
      to: 'Hawa Mahal',
      fare: 145,
      status: 'completed'
    }
  ]
};

// Simulated API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Tool: Get Ride Status
 * Returns current status of an active or recent ride
 */
export async function get_ride_status(rideId) {
  await delay(800);
  
  const mockRides = {
    'RIDE_001': {
      rideId: 'RIDE_001',
      status: 'completed',
      from: 'Malviya Nagar, Jaipur',
      to: 'Hawa Mahal, Jaipur',
      fare: 145,
      driver: { name: 'Rajesh Kumar', rating: 4.8 },
      completedAt: '2026-08-01 10:30 AM'
    },
    'RIDE_ACTIVE': {
      rideId: 'RIDE_ACTIVE',
      status: 'en_route',
      from: 'Vaishali Nagar, Jaipur',
      to: 'City Palace, Jaipur',
      estimatedFare: 180,
      driver: {
        name: 'Amit Singh',
        phone: '+91-XXXXX-XX210',
        vehicle: 'Maruti Swift (RJ-14-AB-1234)',
        rating: 4.9
      },
      eta: '3 minutes',
      driverLocation: { lat: 26.9150, lng: 75.7900 }
    }
  };
  
  const ride = mockRides[rideId];
  if (!ride) {
    return { error: 'Ride not found. Please check the ride ID.' };
  }
  
  return { success: true, data: ride };
}

/**
 * Tool: Track Driver
 * Returns real-time driver location and ETA
 */
export async function track_driver(rideId) {
  await delay(600);
  
  const mockTracking = {
    'RIDE_ACTIVE': {
      driver: {
        name: 'Amit Singh',
        location: { lat: 26.9150, lng: 75.7900 },
        heading: 'Northeast',
        speed: '25 km/h'
      },
      eta: '3 minutes',
      distance: '1.2 km',
      route: 'Via Tonk Road → JLN Marg'
    }
  };
  
  const tracking = mockTracking[rideId];
  if (!tracking) {
    return { error: 'No active tracking for this ride.' };
  }
  
  return { success: true, data: tracking };
}

/**
 * Tool: Get Fare Estimate
 * Calculates fare for a potential ride
 */
export async function get_fare_estimate(pickup, dropoff, rideType = 'UgoX', promoCode = null) {
  await delay(1000);
  
  // Mock fare calculation
  const baseRates = {
    'UgoAuto': { base: 10, perKm: 16, perMin: 2 },
    'UgoMoto': { base: 8, perKm: 12, perMin: 1.5 },
    'UgoX': { base: 20, perKm: 30, perMin: 3 },
    'UgoXL': { base: 30, perKm: 48, perMin: 4 }
  };
  
  const rate = baseRates[rideType] || baseRates['UgoX'];
  const estimatedKm = 5 + Math.random() * 10; // Mock distance
  const estimatedMin = 10 + Math.random() * 20; // Mock time
  
  let fare = rate.base + (rate.perKm * estimatedKm) + (rate.perMin * estimatedMin);
  let surgeMultiplier = 1.0;
  let discount = 0;
  
  // Check peak hours (mock surge)
  const hour = new Date().getHours();
  if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 22)) {
    surgeMultiplier = 1.5;
    fare *= surgeMultiplier;
  }
  
  // Apply promo code
  if (promoCode) {
    const validPromos = {
      'FIRST50': { discount: 50, type: 'flat' },
      'WEEKEND25': { discount: 25, type: 'percent' },
      'UPI50': { discount: 50, type: 'flat' }
    };
    
    const promo = validPromos[promoCode.toUpperCase()];
    if (promo) {
      discount = promo.type === 'flat' ? promo.discount : (fare * promo.discount / 100);
      fare -= discount;
    }
  }
  
  return {
    success: true,
    data: {
      pickup,
      dropoff,
      rideType,
      estimatedDistance: `${estimatedKm.toFixed(1)} km`,
      estimatedTime: `${Math.round(estimatedMin)} min`,
      baseFare: rate.base,
      distanceCharge: Math.round(rate.perKm * estimatedKm),
      timeCharge: Math.round(rate.perMin * estimatedMin),
      surge: surgeMultiplier > 1 ? `${surgeMultiplier}x` : 'No surge',
      discount: discount > 0 ? Math.round(discount) : 0,
      totalFare: Math.round(fare),
      breakdown: `₹${rate.base} base + ₹${Math.round(rate.perKm * estimatedKm)} distance + ₹${Math.round(rate.perMin * estimatedMin)} time${surgeMultiplier > 1 ? ` × ${surgeMultiplier}` : ''}${discount > 0 ? ` - ₹${Math.round(discount)} promo` : ''}`
    }
  };
}

/**
 * Tool: Book Ride
 * Creates a new ride booking
 */
export async function book_ride(pickup, dropoff, rideType = 'UgoX') {
  await delay(1500);
  
  const rideId = `RIDE_${Date.now()}`;
  
  return {
    success: true,
    data: {
      rideId,
      status: 'searching',
      message: 'Looking for nearby drivers...',
      pickup,
      dropoff,
      rideType,
      estimatedWait: '2-4 minutes'
    }
  };
}

/**
 * Tool: Cancel Ride
 * Cancels an active ride with fee calculation
 */
export async function cancel_ride(rideId, reason = 'user_request') {
  await delay(800);
  
  // Mock cancellation logic
  const ride = await get_ride_status(rideId);
  
  if (!ride.success) {
    return { error: 'Ride not found or already completed.' };
  }
  
  let cancellationFee = 0;
  const timeSinceBooking = 5; // Mock: minutes since booking
  
  if (timeSinceBooking > 2 && ride.data.status !== 'completed') {
    const fees = { 'UgoAuto': 15, 'UgoMoto': 15, 'UgoX': 30, 'UgoXL': 40 };
    cancellationFee = fees[ride.data.rideType] || 30;
  }
  
  return {
    success: true,
    data: {
      rideId,
      cancelled: true,
      cancellationFee,
      message: cancellationFee > 0 
        ? `Ride cancelled. Cancellation fee: ₹${cancellationFee}` 
        : 'Ride cancelled successfully. No charges.'
    }
  };
}

/**
 * Tool: Get Receipt
 * Retrieves detailed receipt for a completed ride
 */
export async function get_receipt(rideId) {
  await delay(700);
  
  const ride = await get_ride_status(rideId);
  
  if (!ride.success || ride.data.status !== 'completed') {
    return { error: 'Receipt only available for completed rides.' };
  }
  
  return {
    success: true,
    data: {
      rideId: ride.data.rideId,
      date: ride.data.completedAt,
      from: ride.data.from,
      to: ride.data.to,
      distance: '8.5 km',
      duration: '22 min',
      baseFare: 20,
      distanceCharge: 105,
      timeCharge: 20,
      surge: 0,
      discount: 0,
      totalFare: ride.data.fare,
      paymentMethod: 'UPI',
      driver: ride.data.driver
    }
  };
}

/**
 * Tool: Create Support Ticket
 * Creates a support ticket for human agent review
 */
export async function create_support_ticket(summary, rideId = null, priority = 'normal', category = 'general') {
  await delay(1000);
  
  const ticketId = `TKT_${Date.now()}`;
  
  return {
    success: true,
    data: {
      ticketId,
      status: 'open',
      priority,
      category,
      summary,
      rideId,
      createdAt: new Date().toISOString(),
      estimatedResponse: priority === 'urgent' ? '5 minutes' : '30 minutes'
    }
  };
}

/**
 * Tool: Transfer to Human Agent
 * Initiates handoff to live support agent with full context
 */
export async function transfer_to_human_agent(conversationSummary, rideId = null, reason = 'user_request') {
  await delay(1200);
  
  // Create support ticket first
  const ticket = await create_support_ticket(
    conversationSummary,
    rideId,
    reason === 'safety' ? 'urgent' : 'high',
    reason
  );
  
  return {
    success: true,
    data: {
      ticketId: ticket.data.ticketId,
      status: 'transferring',
      message: reason === 'safety' 
        ? '🚨 Connecting you to our safety team immediately...' 
        : '👤 Connecting you to a support agent...',
      estimatedWait: reason === 'safety' ? '30 seconds' : '2-3 minutes',
      queuePosition: reason === 'safety' ? 1 : 3,
      agentType: reason === 'safety' ? 'Safety Specialist' : 'Customer Support'
    }
  };
}

/**
 * Tool: Check Promo Code
 * Validates a promo code
 */
export async function check_promo_code(promoCode) {
  await delay(500);
  
  const validPromos = {
    'FIRST50': { 
      valid: true, 
      discount: '₹50 off',
      minFare: 100,
      description: 'First ride discount',
      expiresIn: '30 days'
    },
    'WEEKEND25': {
      valid: true,
      discount: '25% off',
      minFare: 150,
      description: 'Weekend special',
      expiresIn: 'This Sunday'
    },
    'UPI50': {
      valid: true,
      discount: '₹50 off on UPI',
      minFare: 120,
      description: 'UPI payment offer',
      expiresIn: '7 days'
    }
  };
  
  const promo = validPromos[promoCode.toUpperCase()];
  
  if (!promo) {
    return {
      success: false,
      error: 'Invalid or expired promo code.'
    };
  }
  
  return {
    success: true,
    data: promo
  };
}

/**
 * Get user session data
 */
export function get_user_session() {
  return mockUserSession;
}

/**
 * Detect if user needs immediate escalation
 */
export function detect_escalation_need(message, sentiment = 'neutral') {
  const lowerMsg = message.toLowerCase();
  
  // Safety keywords - immediate escalation
  const safetyKeywords = [
    'unsafe', 'threat', 'accident', 'crash', 'hurt', 'injured',
    'harassment', 'assault', 'danger', 'emergency', 'police', 'help me'
  ];
  
  if (safetyKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return { escalate: true, reason: 'safety', priority: 'urgent' };
  }
  
  // Human request
  const humanKeywords = [
    'human', 'agent', 'person', 'talk to someone', 'speak to',
    'representative', 'supervisor', 'manager', 'real person'
  ];
  
  if (humanKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return { escalate: true, reason: 'user_request', priority: 'high' };
  }
  
  // Frustration indicators
  const frustrationKeywords = [
    'useless', 'stupid', 'terrible', 'worst', 'angry', 'frustrated',
    'not helping', 'waste of time', 'complain', 'refund now'
  ];
  
  if (sentiment === 'negative' || frustrationKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return { escalate: true, reason: 'frustration', priority: 'high' };
  }
  
  // Payment disputes
  const paymentKeywords = [
    'overcharge', 'wrong charge', 'unauthorized', 'fraud', 'refund',
    'dispute charge', 'charge back'
  ];
  
  if (paymentKeywords.some(keyword => lowerMsg.includes(keyword))) {
    return { escalate: true, reason: 'payment_dispute', priority: 'high' };
  }
  
  return { escalate: false };
}
