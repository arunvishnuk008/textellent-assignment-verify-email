import { useState } from 'react';

export default function SMSMarketingForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const domain = formData.email.split('@')[1];

    if(domain === 'textellent.com' && formData.company.trim().toLowerCase() === 'textellent') {
      setApiResponse({
        spam: 'no',
        confidence: 'high',
        reason: 'Email domain is from trusted company - textellent',
        result: 'passed'
      });
      setShowModal(true);
      setIsSubmitting(false);
    } else {

    try {
      const response = await fetch('https://studioredgreen.app.n8n.cloud/webhook/b10d4c95-4a96-41e0-a138-1ecd3b2eceaa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.firstName + ' ' + formData.lastName,
          emailDomain: domain,
          company: formData.company,
          email: formData.email
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setApiResponse(data[0]);
      setShowModal(true);

    } catch (error) {
      console.error('API Error:', error);
      setApiResponse({
        spam: 'yes',
        confidence: 'high',
        reason: 'Could not connect to the server',
        result: 'failed'
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    
    if (apiResponse?.result === 'passed') {
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        agreeToTerms: false
      });
      setErrors({});
    }
    setApiResponse(null);
  };

  const getResultColor = (result) => {
    switch(result?.toLowerCase()) {
      case 'passed': return '#10b981';
      case 'failed': return '#ef4444';
      case 'vetting': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch(confidence?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center p-4" 
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #6366f1 100%)'
        }}
      >
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Unlock Powerful SMS Marketing
            </h1>
            <h2 
              className="text-3xl md:text-4xl font-semibold" 
              style={{ color: '#6366f1' }}
            >
              Start Your Free Trial Now
            </h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400`}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Business Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-400`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <label htmlFor="agreeToTerms" className="text-gray-700 text-sm">
                  I agree to the{' '}
                  <a 
                    href="#" 
                    className="text-indigo-500 hover:text-indigo-600 underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    terms of service
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-full text-white text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)'
                }}
              >
                {isSubmitting ? 'Creating Account...' : 'Create My Account'}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200"></div>
        </div>
      </div>

      {showModal && apiResponse && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Results
              </h3>
              <div className="h-1 w-20 mx-auto rounded-full mb-4" style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)'
              }}></div>
              
              {apiResponse.result?.toLowerCase() === 'passed' ? (
                <p className="text-lg text-gray-700 mt-4">
                  Welcome <span className="font-bold text-indigo-600">{formData.firstName} {formData.lastName}</span> to Textellent platform!
                </p>
              ) : (
                <p className="text-lg text-gray-700 mt-4">
                  Sorry, <span className="font-bold text-red-600">{formData.firstName} {formData.lastName}</span>, we were unable to create an account for you due to the following reason:
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase">Status</span>
                  <span 
                    className="text-lg font-bold uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${getResultColor(apiResponse.result)}20`,
                      color: getResultColor(apiResponse.result)
                    }}
                  >
                    {apiResponse.result}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase">Spam Detection</span>
                  <span 
                    className={`text-lg font-bold uppercase px-3 py-1 rounded-full ${
                      apiResponse.spam?.toLowerCase() === 'yes' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {apiResponse.spam}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600 uppercase">Confidence</span>
                  <span 
                    className="text-lg font-bold uppercase px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${getConfidenceColor(apiResponse.confidence)}20`,
                      color: getConfidenceColor(apiResponse.confidence)
                    }}
                  >
                    {apiResponse.confidence}
                  </span>
                </div>
              </div>

              {apiResponse.reason && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="text-sm font-semibold text-gray-600 uppercase block mb-2">Reason</span>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {apiResponse.reason}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={closeModal}
                className="px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}