import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Mail, FileText, User, Car, Send, X, ChevronDown } from 'lucide-react';
import { getAIResponse, getQuickReplies } from '../utils/aiKnowledgeBase';
import './Help.css';

const Help = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('rider'); // 'rider' or 'driver'
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      message: `Hello! I'm your Ugo AI assistant. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Rider FAQs
  const riderFaqs = [
    {
      question: "How do I book a ride in Jaipur?",
      answer: "Open the Ugo app, enter your pickup and dropoff locations, select your preferred ride type (UgoX, UgoAuto, UgoMoto, or UgoXL), and tap 'See prices'. Review the fare and confirm your booking. A nearby driver will be assigned to you immediately."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept multiple payment methods including Cash, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Ugo Wallet. You can set your preferred payment method in the app settings."
    },
    {
      question: "How is the fare calculated?",
      answer: "Fares are calculated based on distance (per km), time (per minute), base fare, and current demand. You'll see the estimated fare before booking. UgoAuto starts at ₹16/km, UgoMoto at ₹12/km, UgoX at ₹30/km, and UgoXL at ₹48/km."
    },
    {
      question: "Can I cancel my ride? What are the charges?",
      answer: "Yes, you can cancel a ride. If you cancel within 2 minutes of booking, there's no charge. After 2 minutes, a cancellation fee of ₹20-₹50 applies depending on the ride type. If the driver has already arrived, full cancellation charges apply."
    },
    {
      question: "What if I left something in the vehicle?",
      answer: "Go to 'My Rides' > select the trip > tap 'I lost an item'. You can contact the driver directly through the app. Our support team is also available 24/7 to help you recover lost items."
    },
    {
      question: "How can I add a stop during my ride?",
      answer: "Tap on the destination bar during your ride and select 'Add Stop'. You can add up to 2 stops. Note that waiting time charges of ₹2/minute apply if the ride is paused for more than 3 minutes."
    },
    {
      question: "Is Ugo safe for women traveling alone?",
      answer: "Absolutely. All drivers undergo thorough background verification. We have 24/7 safety support, real-time GPS tracking, and a safety button to share your ride with emergency contacts. You can also share trip details with family/friends."
    },
    {
      question: "What should I do if the driver takes a wrong route?",
      answer: "You can guide the driver using the in-app GPS navigation. If you notice a deliberately longer route, report it immediately through the app. We'll review the trip and issue a refund if necessary."
    },
    {
      question: "Can I schedule a ride for later?",
      answer: "Yes! Use Ugo Reserve to schedule rides up to 90 days in advance. Go to 'Reserve' from the menu, enter your trip details, date, and time. Your ride will be confirmed and a driver assigned closer to your pickup time."
    },
    {
      question: "How do I rate my driver?",
      answer: "After each trip, you'll be prompted to rate your driver on a 5-star scale and provide optional feedback. Your ratings help maintain service quality and reward excellent drivers."
    }
  ];

  // Driver FAQs
  const driverFaqs = [
    {
      question: "What are the requirements to become a Ugo driver?",
      answer: "You need: Valid driving license (at least 1 year old), Vehicle registration certificate (RC), Valid insurance, PUC certificate, Aadhaar card, PAN card, Bank account details, and a smartphone with 4G. Your vehicle should be in good condition and not older than 10 years."
    },
    {
      question: "How do I earn with Ugo?",
      answer: "You earn per ride based on distance and time. UgoAuto: ₹16/km + ₹2/min, UgoMoto: ₹12/km + ₹1.5/min, UgoX: ₹30/km + ₹3/min, UgoXL: ₹48/km + ₹4/min. During peak hours, surge pricing can increase earnings by 1.5x to 2.5x. You keep 75% of each fare."
    },
    {
      question: "When do I receive my earnings?",
      answer: "Earnings are calculated daily and transferred to your bank account within 24 hours. You can track your daily, weekly, and monthly earnings in the driver app dashboard. Instant withdrawal is available for premium drivers."
    },
    {
      question: "What are the working hours? Can I drive part-time?",
      answer: "You have complete flexibility! Drive whenever you want - full-time or part-time. There are no minimum hour requirements. Many drivers work during peak hours (7-10 AM, 5-10 PM) to maximize earnings with surge pricing."
    },
    {
      question: "What happens if a rider cancels the trip?",
      answer: "If the rider cancels after you've accepted and started moving towards them, you receive a cancellation fee (₹20-₹50). If you've reached the pickup location and waited for more than 5 minutes, you get full cancellation compensation."
    },
    {
      question: "How do I handle difficult passengers?",
      answer: "Stay calm and professional. If a passenger is abusive or threatening, end the trip safely and report immediately through the driver app. We have zero tolerance for passenger misconduct. You can decline future ride requests from problematic riders."
    },
    {
      question: "What should I do in case of an accident?",
      answer: "First, ensure everyone's safety and call emergency services if needed. Then immediately report the incident through the driver app. All rides are covered by insurance. Our 24/7 support team will guide you through the claims process."
    },
    {
      question: "Can I decline ride requests?",
      answer: "Yes, but maintaining a high acceptance rate (above 80%) gives you priority access to ride requests and premium earnings opportunities. However, you can always decline if you're uncomfortable or need a break."
    },
    {
      question: "How does the rating system work for drivers?",
      answer: "Riders rate you after each trip (1-5 stars). Your overall rating is visible to riders. Maintain a rating above 4.5 to keep driving. Ratings below 4.0 may result in temporary suspension. Excellent ratings (4.8+) unlock premium benefits."
    },
    {
      question: "What support is available for vehicle maintenance?",
      answer: "We have partnerships with service centers across Jaipur offering 10-20% discounts on maintenance. The app provides maintenance reminders. Top-rated drivers get access to priority service and emergency roadside assistance."
    }
  ];

  // AI Chatbot Logic
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    const newUserMsg = {
      type: 'user',
      message: userMessage,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newUserMsg]);
    
    // Enhanced AI response using knowledge base
    setTimeout(() => {
      const botResponse = getAIResponse(userMessage, selectedCategory);
      const newBotMsg = {
        type: 'bot',
        message: botResponse,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newBotMsg]);
    }, 1000);

    setUserMessage('');
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const currentFaqs = selectedCategory === 'rider' ? riderFaqs : driverFaqs;

  // Quick reply suggestions
  const quickReplies = getQuickReplies(selectedCategory);

  const handleQuickReply = (reply) => {
    setUserMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="help-page">
      {/* Hero Section */}
      <section className="help-hero">
        <div className="help-hero-content">
          <h1>How can we help you?</h1>
          <p>Get support, find answers, and connect with our team</p>
          
          {/* Category Toggle */}
          <div className="category-toggle">
            <button
              className={`toggle-btn ${selectedCategory === 'rider' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('rider')}
            >
              <User size={20} />
              <span>I'm a Rider</span>
            </button>
            <button
              className={`toggle-btn ${selectedCategory === 'driver' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('driver')}
            >
              <Car size={20} />
              <span>I'm a Driver</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="help-quick-actions">
        <div className="help-container">
          <div className="quick-actions-grid">
            <div className="quick-action-card" onClick={() => setShowChatbot(true)}>
              <div className="action-icon">
                <MessageCircle size={32} />
              </div>
              <h3>AI Assistant</h3>
              <p>Chat with our AI for instant answers</p>
              <button className="action-btn">Start Chat</button>
            </div>

            <a href="tel:+911800XXXXXX" className="quick-action-card">
              <div className="action-icon">
                <Phone size={32} />
              </div>
              <h3>Call Support</h3>
              <p>24/7 phone support available</p>
              <button className="action-btn">Call Now</button>
            </a>

            <a href="mailto:support@ugo.com" className="quick-action-card">
              <div className="action-icon">
                <Mail size={32} />
              </div>
              <h3>Email Us</h3>
              <p>Get help via email</p>
              <button className="action-btn">Send Email</button>
            </a>

            <div className="quick-action-card" onClick={() => document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' })}>
              <div className="action-icon">
                <FileText size={32} />
              </div>
              <h3>FAQs</h3>
              <p>Browse frequently asked questions</p>
              <button className="action-btn">View FAQs</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="help-contact-info">
        <div className="help-container">
          <h2>Contact Support</h2>
          <div className="contact-info-grid">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone Support</h3>
              <p className="contact-detail">+91 1800-XXX-XXXX</p>
              <p className="contact-hours">Available 24/7</p>
              <p className="contact-note">Toll-free number for India</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p className="contact-detail">support@ugo.com</p>
              <p className="contact-hours">Response within 24 hours</p>
              <p className="contact-note">For non-urgent queries</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h3>Live Chat</h3>
              <p className="contact-detail">In-App Messaging</p>
              <p className="contact-hours">Available 24/7</p>
              <p className="contact-note">Instant support in the app</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🏢</div>
              <h3>Office Address</h3>
              <p className="contact-detail">Ugo India Pvt Ltd</p>
              <p className="contact-hours">Malviya Nagar, Jaipur</p>
              <p className="contact-note">Rajasthan - 302017</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq-section" className="help-faqs">
        <div className="help-container">
          <h2>Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            {selectedCategory === 'rider' 
              ? 'Common questions from riders like you' 
              : 'Common questions from drivers like you'}
          </p>

          <div className="faq-list">
            {currentFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <ChevronDown 
                    size={24} 
                    className={`faq-icon ${expandedFaq === index ? 'rotated' : ''}`}
                  />
                </div>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="help-categories">
        <div className="help-container">
          <h2>Browse Help Topics</h2>
          <div className="categories-grid">
            {selectedCategory === 'rider' ? (
              <>
                <div className="category-card">
                  <div className="category-icon">🚗</div>
                  <h3>Booking & Rides</h3>
                  <ul>
                    <li>How to book a ride</li>
                    <li>Ride options explained</li>
                    <li>Scheduling future rides</li>
                    <li>Adding stops</li>
                  </ul>
                </div>
                <div className="category-card">
                  <div className="category-icon">💳</div>
                  <h3>Payments & Pricing</h3>
                  <ul>
                    <li>Payment methods</li>
                    <li>Fare calculation</li>
                    <li>Promo codes</li>
                    <li>Refunds</li>
                  </ul>
                </div>
                <div className="category-card">
                  <div className="category-icon">👤</div>
                  <h3>Account & Profile</h3>
                  <ul>
                    <li>Update profile</li>
                    <li>Change phone/email</li>
                    <li>Delete account</li>
                    <li>Privacy settings</li>
                  </ul>
                </div>
                <div className="category-card">
                  <div className="category-icon">🛡️</div>
                  <h3>Safety & Security</h3>
                  <ul>
                    <li>Safety features</li>
                    <li>Emergency assistance</li>
                    <li>Share trip details</li>
                    <li>Report issues</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="category-card">
                  <div className="category-icon">💰</div>
                  <h3>Earnings & Payments</h3>
                  <ul>
                    <li>How earnings work</li>
                    <li>Payment schedule</li>
                    <li>Surge pricing</li>
                    <li>Incentives</li>
                  </ul>
                </div>
                <div className="category-card">
                  <div className="category-icon">📱</div>
                  <h3>App & Technology</h3>
                  <ul>
                    <li>Using driver app</li>
                    <li>GPS navigation</li>
                    <li>Accepting rides</li>
                    <li>Troubleshooting</li>
                  </ul>
                </div>
                <div className="category-card">
                  <div className="category-icon">⭐</div>
                  <h3>Ratings & Performance</h3>
                  <ul>
                    <li>Rating system</li>
                    <li>Improve ratings</li>
                    <li>Acceptance rate</li>
                    <li>Performance bonuses</li>
                  </ul>
                </div>
                <div className="category-card">
                  <div className="category-icon">🔧</div>
                  <h3>Vehicle & Documents</h3>
                  <ul>
                    <li>Required documents</li>
                    <li>Vehicle maintenance</li>
                    <li>Insurance</li>
                    <li>Update vehicle info</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="help-cta">
        <div className="help-container">
          <div className="cta-content">
            <h2>Still need help?</h2>
            <p>Our support team is available 24/7 to assist you</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => setShowChatbot(true)}>
                <MessageCircle size={20} />
                Chat with AI Assistant
              </button>
              <button className="btn-secondary" onClick={() => navigate(selectedCategory === 'rider' ? '/login' : '/driver-onboarding')}>
                {selectedCategory === 'rider' ? 'Sign In to Get Help' : 'Driver Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Modal */}
      {showChatbot && (
        <div className="chatbot-overlay" onClick={() => setShowChatbot(false)}>
          <div className="chatbot-container" onClick={(e) => e.stopPropagation()}>
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="bot-avatar">🤖</div>
                <div>
                  <h3>Ugo AI Assistant</h3>
                  <p className="bot-status">
                    <span className="status-dot"></span>
                    Online • {selectedCategory === 'rider' ? 'Rider' : 'Driver'} Support
                  </p>
                </div>
              </div>
              <button className="close-chatbot" onClick={() => setShowChatbot(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="chatbot-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.type}`}>
                  {msg.type === 'bot' && <div className="message-avatar">🤖</div>}
                  <div className="message-content">
                    <p>{msg.message}</p>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                  {msg.type === 'user' && <div className="message-avatar user-avatar">👤</div>}
                </div>
              ))}
            </div>

            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} disabled={!userMessage.trim()}>
                <Send size={20} />
              </button>
            </div>

            <div className="chatbot-footer">
              <p>Powered by Ugo AI • Available 24/7</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
