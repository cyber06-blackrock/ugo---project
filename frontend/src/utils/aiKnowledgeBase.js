// Enhanced AI Knowledge Base - Trained on real ride-sharing support systems
// Based on Uber, Ola, Lyft customer support patterns
// This serves as fallback knowledge when tools aren't needed

export const SYSTEM_PROMPT = `You are Ugo Assistant, the official AI ride assistant for Ugo, a ride-hailing platform in Jaipur, India.

ROLE
Help riders book, track, modify, and troubleshoot rides using Ugo's live systems.
You are friendly, concise, and efficient — riders are often in a hurry. Use short, clear responses with emojis where appropriate.

STRICT RULES — DATA ACCURACY
1. Never state a fare, ETA, ride status, or driver location from memory. ALWAYS use tools.
2. If a tool fails, tell the user honestly and offer human agent connection.
3. Never invent policies. If unsure, escalate to human.
4. Always confirm before taking irreversible actions (cancel ride, create ticket).

WHEN TO ESCALATE TO HUMAN (use transfer_to_human_agent tool)
Escalate IMMEDIATELY when:
- User explicitly asks for human/agent/support person
- Safety incident, threat, accident, or feels unsafe
- Payment dispute, unauthorized charge, refund request
- User is frustrated/angry after failed attempt
- Tool calls fail repeatedly
- Driver complaint requiring human judgment

TONE
Warm, direct, and calm. No corporate filler. Get to the answer fast.`;

export const AI_KNOWLEDGE_BASE = {
  // Rider Support Knowledge
  rider: {
    // Booking & Rides
    booking: {
      keywords: ['book', 'ride', 'request', 'how to', 'start', 'order', 'get a ride', 'hail'],
      responses: [
        "To book a ride with Ugo:\n\n1️⃣ Open the app and allow location access\n2️⃣ Enter your pickup location (or use 'Current Location')\n3️⃣ Enter your destination\n4️⃣ Choose vehicle type (UgoX, UgoAuto, UgoMoto, UgoXL)\n5️⃣ Review fare estimate\n6️⃣ Tap 'Confirm Ride'\n7️⃣ A nearby driver will accept within 30-60 seconds\n\n📱 Need help with a specific step?"
      ]
    },
    
    cancellation: {
      keywords: ['cancel', 'cancellation', 'cancel ride', 'cancel booking', 'cancel trip', 'refund cancel'],
      responses: [
        "📋 Ugo Cancellation Policy:\n\n✅ FREE Cancellation:\n• Within 2 minutes of booking\n• If driver is more than 10 min away\n• If driver doesn't move for 5+ minutes\n\n💰 Cancellation Fees:\n• UgoAuto/Moto: ₹15-₹20\n• UgoX: ₹30-₹40\n• UgoXL: ₹40-₹50\n\n❌ Full Fare Charged:\n• If driver has arrived and you cancel\n• After 5 minutes of driver arrival\n\n📲 To cancel: Tap 'Cancel Ride' on booking screen\n\nNeed to cancel a specific ride?"
      ]
    },

    payment: {
      keywords: ['payment', 'pay', 'payment method', 'card', 'cash', 'upi', 'wallet', 'paytm', 'gpay', 'phonepe', 'failed payment', 'payment declined'],
      responses: [
        "💳 Ugo Payment Options:\n\n✅ Available Methods:\n• Cash (pay driver directly)\n• UPI (Google Pay, PhonePe, Paytm, BHIM)\n• Credit/Debit Cards (Visa, Mastercard, RuPay)\n• Net Banking (all major banks)\n• Ugo Wallet (instant payments, cashback offers)\n\n🔧 To add/change payment:\n1. Tap Profile → Payments\n2. Select 'Add Payment Method'\n3. Choose preferred option\n4. Complete verification\n\n🚨 Payment Failed?\n• Check internet connection\n• Ensure sufficient balance\n• Try alternative method\n• Contact bank if repeated failures\n\nHaving a specific payment issue?"
      ]
    },

    lostItems: {
      keywords: ['lost', 'left', 'forgot', 'missing', 'lost item', 'left something', 'retrieve', 'recover item'],
      responses: [
        "😟 Lost Something? Here's how to recover it:\n\n📱 Via App (Recommended):\n1. Go to 'My Rides'\n2. Select the trip\n3. Tap 'I lost an item'\n4. Describe the item\n5. Driver will be notified\n\n📞 Direct Contact:\n• Call driver through app (number masked)\n• Available for 24 hours after trip\n\n🏢 Lost & Found Center:\n• After 48 hours, items go to our center\n• Location: Malviya Nagar, Jaipur\n• Hours: 10 AM - 6 PM (Mon-Sat)\n\n💡 Tips:\n• Report immediately (higher recovery rate)\n• Be specific about item description\n• Mention exact drop location\n\n⚠️ Driver found your item?\n• You can arrange pickup or request delivery (₹50 fee)\n\nWhat did you lose?"
      ]
    },

    safety: {
      keywords: ['safe', 'safety', 'security', 'emergency', 'danger', 'uncomfortable', 'threat', 'women safety', 'alone', 'night'],
      responses: [
        "🛡️ Your Safety is Our Priority!\n\n✅ Safety Features:\n• Real-time GPS tracking\n• Share trip with family/friends\n• Emergency SOS button (connects to police)\n• 24/7 safety helpline: 1800-XXX-XXXX\n• Driver details visible before ride\n• In-app calling (masked numbers)\n\n👤 Driver Verification:\n• Background checks mandatory\n• Police verification\n• License validation\n• Regular audits\n\n🚨 Emergency Features:\n• Tap SOS to alert our team instantly\n• Auto-share location with emergency contacts\n• Direct police connection\n\n👩 Women Safety:\n• Female-only rides option\n• Trusted driver badge program\n• Safety check-ins during night rides\n\n⚠️ Feel unsafe RIGHT NOW?\n• Tap SOS button immediately\n• Or call: 1800-XXX-XXXX\n• Stay calm, we're monitoring your location\n\nNeed immediate help?"
      ]
    },

    fare: {
      keywords: ['fare', 'price', 'cost', 'charge', 'expensive', 'estimate', 'calculate', 'surge', 'peak pricing', 'how much'],
      responses: [
        "💰 Ugo Fare Structure:\n\n🚗 Base Rates (Jaipur):\n• UgoAuto: ₹16/km + ₹2/min + ₹10 base\n• UgoMoto: ₹12/km + ₹1.5/min + ₹8 base\n• UgoX: ₹30/km + ₹3/min + ₹20 base\n• UgoXL: ₹48/km + ₹4/min + ₹30 base\n\n📊 Fare Calculation:\n✅ Distance charges\n✅ Time charges\n✅ Base fare\n✅ Applicable taxes\n✅ Tolls (if any)\n\n📈 Surge Pricing:\n• Peak hours: 7-10 AM, 5-10 PM\n• Bad weather, festivals\n• High demand areas\n• Multiplier: 1.2x to 2.5x\n• ⚠️ You'll see surge warning before booking\n\n🎁 Save Money:\n• Use Ugo Auto/Moto for short trips\n• Book during off-peak hours\n• Use promo codes\n• Ugo Pass: Unlimited rides subscription\n\n💡 Fare seems wrong?\n• Report fare dispute in app\n• We review within 24 hours\n• Automatic refund if overcharged\n\nNeed fare estimate for a trip?"
      ]
    },

    driver: {
      keywords: ['driver', 'driver late', 'driver not moving', 'driver rude', 'driver issue', 'bad driver', 'driver misbehave', 'report driver', 'driver rating'],
      responses: [
        "👨‍✈️ Driver-Related Support:\n\n⏰ Driver Running Late?\n• Track real-time on map\n• Driver has 5-min grace period\n• Cancel free if delayed 10+ min\n• Call driver through app\n\n🚫 Driver Not Moving?\n• Check if stuck in traffic (map view)\n• Call to confirm pickup\n• Cancel if no response (no charge)\n• Report if suspected fraud\n\n😠 Driver Behavior Issues?\n• End trip safely first\n• Report immediately: 'My Rides' → Trip → 'Report Issue'\n• Categories: Rude, Unsafe driving, Refused ride, Asked cancel\n• Automatic investigation\n• Driver suspended if verified\n\n⭐ Rating Drivers:\n• Rate honestly after each trip\n• Low ratings trigger review\n• Your feedback improves service\n\n🆘 Serious Issues (Harassment/Theft):\n• Call safety line: 1800-XXX-XXXX\n• File police complaint\n• We'll cooperate fully\n\n🎯 Report categories:\n• Route issue\n• Rash driving\n• Cleanliness\n• Refusal to follow directions\n• Inappropriate behavior\n• Vehicle mismatch\n\nWhat issue are you facing?"
      ]
    },

    promo: {
      keywords: ['promo', 'coupon', 'discount', 'offer', 'code', 'cashback', 'deal', 'first ride', 'referral'],
      responses: [
        "🎁 Ugo Offers & Promos:\n\n💳 How to Use Promo Codes:\n1. Go to 'Payments'\n2. Tap 'Add Promo Code'\n3. Enter code\n4. Discount applies automatically\n\n🔥 Current Offers:\n• FIRSTRIDE: 50% off (max ₹100) - New users\n• WEEKEND25: 25% off on Sat-Sun\n• UPI50: ₹50 off on UPI payments\n• REFER100: ₹100 for referrer + referee\n\n🎯 Where to find codes:\n• In-app promotions\n• SMS/Email from Ugo\n• Social media (Instagram, Twitter)\n• Festivals & special occasions\n\n👥 Referral Program:\n• Share your code\n• Friend books first ride\n• Both get ₹100 credit\n• Unlimited referrals!\n\n💎 Ugo Pass (Subscription):\n• ₹299/month: 10% off all rides\n• ₹999/quarter: 15% off + priority support\n• Worth it for 15+ rides/month\n\n⚠️ Promo not working?\n• Check validity date\n• Minimum fare requirement\n• One promo per ride\n• User-specific restrictions\n\nLooking for a specific offer?"
      ]
    },

    schedule: {
      keywords: ['schedule', 'reserve', 'advance', 'later', 'future ride', 'pre-book', 'plan ahead', 'tomorrow'],
      responses: [
        "📅 Ugo Reserve - Schedule Rides in Advance:\n\n⏰ How to Schedule:\n1. Go to 'Reserve' from home screen\n2. Enter pickup & destination\n3. Select date & time (up to 90 days ahead)\n4. Choose vehicle type\n5. See upfront price (no surge)\n6. Confirm reservation\n\n✅ Benefits:\n• Guaranteed ride\n• No surge pricing\n• Driver assigned 15 min before\n• Perfect for flights, meetings\n• Free cancellation up to 60 min before\n\n💰 Pricing:\n• Slightly higher than regular (10-15%)\n• But guaranteed no surge\n• Price locked at booking\n\n🎯 Best for:\n• Airport trips\n• Important meetings\n• Early morning rides\n• Outstation travel\n\n❌ Cancellation:\n• Free: 60+ min before pickup\n• Partial charge: 30-60 min before\n• Full charge: <30 min before\n\n⚠️ Important:\n• Be ready 5 min before scheduled time\n• Driver waits only 5 minutes\n• Late? Ride auto-cancelled\n\nWant to schedule a ride now?"
      ]
    }
  },

  // Driver Support Knowledge
  driver: {
    earnings: {
      keywords: ['earn', 'money', 'income', 'salary', 'payment', 'payout', 'weekly', 'daily', 'how much'],
      responses: [
        "💰 Driver Earnings at Ugo:\n\n📊 Commission Structure:\n• You keep: 75% of fare\n• Ugo fee: 25% (platform + payment)\n\n💵 Average Earnings (Jaipur):\n• Part-time (4-6 hrs): ₹15,000-₹30,000/month\n• Full-time (8-10 hrs): ₹40,000-₹70,000/month\n• Top drivers: ₹80,000-₹1,00,000/month\n\n⚡ Maximize Earnings:\n• Peak hours: 7-10 AM, 5-10 PM (1.5x-2.5x surge)\n• Accept 80%+ rides (get priority)\n• Maintain 4.7+ rating (premium requests)\n• Enable long trips\n• Work weekends (higher demand)\n\n🎯 Bonus Programs:\n• Complete 10 trips/day: +₹200\n• 70 trips/week: +₹1,000\n• Monthly milestone: +₹3,000\n• Referral: ₹500 per driver\n\n💳 Payment Schedule:\n• Calculated: Daily\n• Transferred: Within 24 hours\n• To: Your linked bank account\n• Method: NEFT/IMPS\n• Track: Driver app dashboard\n\n🚀 Premium Tier Benefits:\n• Rating 4.8+\n• Instant withdrawal (no 24hr wait)\n• Higher commission (80-20 split)\n• Priority support\n\nWant earning improvement tips?"
      ]
    },

    onboarding: {
      keywords: ['join', 'signup', 'register', 'become driver', 'start driving', 'apply', 'requirements', 'documents needed'],
      responses: [
        "🚗 Become an Ugo Driver:\n\n📋 Requirements:\n\n👤 Personal Documents:\n✅ Valid driving license (1+ year old)\n✅ Aadhaar card\n✅ PAN card\n✅ Bank account (IFSC, Account no.)\n✅ Passport-size photo\n✅ Smartphone with 4G\n\n🚙 Vehicle Documents:\n✅ Registration Certificate (RC)\n✅ Valid insurance (comprehensive)\n✅ PUC certificate (Pollution Under Control)\n✅ Fitness certificate\n✅ Permit (for commercial use)\n\n🎯 Vehicle Criteria:\n• Age: Less than 10 years old\n• Condition: Good (inspection required)\n• AC: Mandatory for UgoX/XL\n• Seats: Minimum 4-seater\n\n✨ Application Process:\n1. Go to 'Driver Onboarding' page\n2. Fill personal details\n3. Upload documents\n4. Vehicle inspection scheduled\n5. Background verification (2-3 days)\n6. Training session (1 day)\n7. App activation\n8. Start earning!\n\n⏱️ Timeline:\n• Document verification: 24-48 hours\n• Background check: 2-3 days\n• Total: 3-5 days\n\n💰 Costs:\n• Registration: FREE\n• Training: FREE\n• First month commission: Waived\n\n🎁 New Driver Benefits:\n• First 20 rides: 90-10 split\n• ₹500 signup bonus\n• Free navigation for 3 months\n\n❌ Rejected?\n• Incomplete documents: Resubmit\n• License issues: Renew & reapply\n• Vehicle age: Try different vehicle\n• Criminal record: Cannot proceed\n\nReady to start?"
      ]
    },

    rating: {
      keywords: ['rating', 'star', 'low rating', 'improve rating', 'rating dropped', 'bad rating', '5 star', 'customer rating'],
      responses: [
        "⭐ Driver Rating System:\n\n📊 How It Works:\n• Riders rate you after each trip (1-5 stars)\n• Your overall rating = average of last 500 trips\n• Displayed to riders before they confirm\n• Updated real-time\n\n🎯 Rating Thresholds:\n• 4.8-5.0: ⭐ Premium (top 10%)\n• 4.5-4.7: ✅ Good standing\n• 4.0-4.4: ⚠️ Warning (improvement needed)\n• Below 4.0: 🚫 Deactivation risk\n\n💎 Premium Benefits (4.8+):\n• Priority ride requests\n• Higher commission (80%)\n• Instant withdrawals\n• Exclusive bonuses\n• Premium support\n\n📈 Improve Your Rating:\n\n1️⃣ Vehicle Maintenance:\n• Keep extremely clean\n• Good AC/music\n• Fresh air freshener\n• No smoking smell\n\n2️⃣ Professionalism:\n• Greet warmly\n• Confirm destination\n• Ask about AC/music preference\n• Avoid controversial topics\n• Respect privacy\n\n3️⃣ Navigation:\n• Use GPS religiously\n• Know major routes\n• Ask before alternate routes\n• Update riders on delays\n\n4️⃣ Safety:\n• Follow traffic rules\n• Don't speed\n• Smooth braking\n• Use indicators\n\n5️⃣ Extra Mile:\n• Offer phone charging\n• Keep water bottles\n• Help with luggage\n• Flexible with stops\n\n❌ Rating Killers:\n• Asking to cancel\n• Wrong route/Long route\n• Rude behavior\n• Dirty vehicle\n• Rash driving\n• Refusing AC\n• Phone use while driving\n\n🔍 Monitor Ratings:\n• Check daily in app\n• See recent trip ratings\n• Read feedback\n• Learn from 1-3 star rides\n\n⚠️ Got unfair low rating?\n• You can dispute within 48 hours\n• Provide explanation\n• We review and may remove\n\nNeed specific advice?"
      ]
    },

    cancellation: {
      keywords: ['cancel', 'cancellation fee', 'rider cancel', 'decline', 'acceptance rate', 'cancel compensation'],
      responses: [
        "❌ Cancellation & Acceptance:\n\n👤 Rider Cancels:\n\n💰 You Get Paid If:\n✅ After accepting, you started moving\n✅ Waited at pickup 5+ minutes\n✅ Rider no-show\n✅ Rider requests cancel\n\nFee: ₹20 (Auto) | ₹30 (UgoX) | ₹50 (XL)\n\n🚫 You Don't Get Paid If:\n• Cancelled within 30 sec of accepting\n• You haven't moved\n• You were moving away\n\n🔵 You Cancel:\n\n✅ Valid Reasons (No penalty):\n• Rider unreachable after 3 calls\n• Wrong pickup location\n• Suspicious/unsafe situation\n• Vehicle issue\n• Medical emergency\n\n⚠️ Penalized Cancellations:\n• After accepting, changed mind\n• Too far/traffic\n• Destination known after accept\n• Asked rider to cancel\n\nPenalty: -2% acceptance rate per cancel\n\n📊 Acceptance Rate:\n• Target: 80%+\n• Below 80%: Fewer ride offers\n• Below 60%: Warning\n• Below 40%: Temporary suspension\n\n💡 Before Accepting:\n• Check pickup distance\n• See approximate destination\n• Consider traffic\n• Check surge multiplier\n\n🎯 Tips:\n• Don't accept if unsure\n• Use filters (no long trips during peak)\n• Maintain 85%+ for priority\n\n⚖️ Unfair Cancellation?\n• Report in app\n• Explain situation\n• We review and may restore acceptance rate\n\nQuestions about a specific cancellation?"
      ]
    },

    insurance: {
      keywords: ['accident', 'insurance', 'claim', 'damage', 'collision', 'breakdown', 'emergency', 'repair'],
      responses: [
        "🛡️ Insurance & Accidents:\n\n📋 Coverage:\n✅ All trips automatically insured\n✅ Personal Accident: ₹15 lakhs\n✅ Third-party: ₹10 lakhs\n✅ Vehicle damage: Up to market value\n✅ Passenger cover: ₹5 lakhs each\n\n🚨 During Accident:\n\n⏰ Immediate Actions:\n1. Ensure everyone's safety\n2. Call ambulance if needed: 108\n3. Call police: 100\n4. Take photos (all angles, damage, documents)\n5. Note down:\n   • Other party details\n   • Witness info\n   • Exact location\n   • Time\n\n📱 Report to Ugo:\n1. Open driver app\n2. Go to 'Help' → 'Report Accident'\n3. Upload photos\n4. Fill incident details\n5. Emergency team calls within 10 min\n\n💼 Claim Process:\n\n1️⃣ Ugo Support (Immediate):\n• Accident advisor assigned\n• Guide through documentation\n• Arrange towing if needed\n• Medical assistance coordination\n\n2️⃣ Documentation (24 hours):\n• FIR copy\n• Driver's statement\n• Witness statements\n• Damage photos\n• Medical reports (if injured)\n• Repair estimates\n\n3️⃣ Claim Submission (48 hours):\n• Submit via app\n• Insurance company notified\n• Claim number generated\n\n4️⃣ Processing (7-14 days):\n• Surveyor inspection\n• Claim verification\n• Approval\n\n5️⃣ Settlement:\n• Cashless: Direct to garage\n• Reimbursement: To your account\n\n💰 Deductible:\n• Minor: ₹2,000\n• Major: ₹5,000\n• (Borne by driver)\n\n🔧 Vehicle Breakdown:\n• Roadside assistance: 1800-XXX-XXXX\n• Free towing (within city)\n• Loaner vehicle (24hr+)\n\n⚠️ DONT's:\n• Leave accident spot without police\n• Admit fault\n• Accept cash settlement\n• Delay reporting (max 24 hrs)\n\n🆘 Need Help NOW?\nCall: 1800-XXX-XXXX (24/7)\n\nHave questions about a claim?"
      ]
    },

    app: {
      keywords: ['app issue', 'app not working', 'login problem', 'gps issue', 'app crash', 'offline', 'update app', 'technical'],
      responses: [
        "📱 Driver App Support:\n\n🔧 Common Issues & Fixes:\n\n1️⃣ Login Problems:\n• Check mobile number format\n• Request new OTP (wait 2 min)\n• Clear app cache\n• Reinstall app\n• Contact: 1800-XXX-XXXX\n\n2️⃣ GPS Not Working:\n• Enable location (Settings → Location → Always)\n• Allow app location permission\n• Turn on High Accuracy mode\n• Restart phone\n• Clear Google Maps cache\n\n3️⃣ Not Getting Rides:\n• Check 'Go Online' is ON\n• Verify documents not expired\n• Check acceptance rate (need 60%+)\n• Move to high-demand area\n• Peak hours: 7-10 AM, 5-10 PM\n\n4️⃣ App Freezing/Crashing:\n• Close background apps\n• Free up phone storage (need 1GB+)\n• Update to latest version\n• Reinstall if persists\n• Phone requirements: Android 6+, 2GB RAM\n\n5️⃣ Payment Not Received:\n• Check 'Earnings' tab for status\n• Payments process daily at 6 PM\n• Takes 24 hours to bank\n• Verify bank details correct\n• Contact if 48+ hours delayed\n\n6️⃣ Navigation Issues:\n• Update Google Maps\n• Clear Maps cache\n• Use in-app navigation\n• Download offline maps\n\n⚙️ App Settings:\n• Update automatic\n• Battery optimization OFF for app\n• Do Not Disturb OFF during rides\n• Sound ON for ride alerts\n\n📲 Keep Updated:\n• Check Play Store weekly\n• Enable auto-updates\n• Current version: 4.2.1\n\n🆘 Still Having Issues?\n• Screenshot error message\n• Note exact problem\n• Call: 1800-XXX-XXXX\n• WhatsApp: +91-XXXXX-XXXXX\n• Driver Support Hub (in-person)\n\nDescribe your specific issue?"
      ]
    }
  },

  // Escalation triggers
  escalation: {
    triggers: [
      'speak to human', 'talk to person', 'real person', 'agent', 'representative',
      'not helpful', 'doesn\'t understand', 'need more help', 'urgent', 'emergency',
      'escalate', 'supervisor', 'manager', 'complaint'
    ],
    response: "🤝 I understand you'd like to speak with a human agent.\n\nLet me connect you right away!\n\n📞 Call Support: +91-1800-XXX-XXXX (24/7)\n📧 Email: support@ugo.com\n💬 Live Chat: Agent will join this chat in ~2 minutes\n\n⏰ Average wait time: 2-3 minutes\n\nWhile you wait, can you briefly describe your issue so I can route you to the right specialist?"
  }
};

// Intelligent response matcher with tool calling support
export async function getAIResponse(userQuery, category, useTools = false) {
  const query = userQuery.toLowerCase().trim();
  
  // Import tools dynamically to avoid circular dependency
  const tools = useTools ? await import('./aiTools') : null;
  
  // Check for escalation first
  if (tools) {
    const escalation = tools.detect_escalation_need(query);
    if (escalation.escalate) {
      if (tools) {
        const result = await tools.transfer_to_human_agent(
          `User query: ${userQuery}`,
          null,
          escalation.reason
        );
        
        if (result.success) {
          return `${result.data.message}\n\n📋 Ticket ID: ${result.data.ticketId}\n⏱️ Estimated wait: ${result.data.estimatedWait}\n📊 Queue position: ${result.data.queuePosition}\n\nA ${result.data.agentType} will be with you shortly. Please hold on!`;
        }
      }
      return AI_KNOWLEDGE_BASE.escalation.response;
    }
  }
  
  const knowledge = AI_KNOWLEDGE_BASE[category];
  if (!knowledge) return handleEscalation();

  // Check for explicit escalation triggers
  if (AI_KNOWLEDGE_BASE.escalation.triggers.some(trigger => query.includes(trigger))) {
    return AI_KNOWLEDGE_BASE.escalation.response;
  }

  // Search through knowledge base
  for (const [topic, data] of Object.entries(knowledge)) {
    if (data.keywords && data.keywords.some(keyword => query.includes(keyword))) {
      return data.responses[0];
    }
  }

  // If no match, offer to escalate
  return `I want to help you with "${userQuery}", but I need more details.\n\n❓ Try asking about:\n${category === 'rider' ? '• Booking a ride\n• Payment issues\n• Cancellations\n• Safety features\n• Lost items\n• Fares & pricing' : '• Earnings & payouts\n• Driver registration\n• Rating system\n• App issues\n• Insurance & accidents\n• Cancellation policies'}\n\n💬 Or would you like to speak with a human support agent?`;
}

function handleEscalation() {
  return AI_KNOWLEDGE_BASE.escalation.response;
}

// Get suggested quick replies based on context
export function getQuickReplies(category) {
  if (category === 'rider') {
    return [
      "How do I book a ride?",
      "What payment methods are available?",
      "I lost something in the car",
      "Fare seems too high",
      "Talk to a human agent"
    ];
  } else {
    return [
      "How much can I earn?",
      "When do I get paid?",
      "How to improve my rating?",
      "App is not working",
      "Talk to a human agent"
    ];
  }
}
