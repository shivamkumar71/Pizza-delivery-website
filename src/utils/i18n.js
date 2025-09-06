const translations = {
  'Full Name *': 'Full Name *',
  'Email Address *': 'Email Address *',
  'Password *': 'Password *',
  'Confirm Password *': 'Confirm Password *',
  'Phone Number': 'Phone Number',
  'Address': 'Address',
  'City': 'City',
  'ZIP Code': 'ZIP Code',
  'I agree to the Terms of Service and Privacy Policy': 'I agree to the Terms of Service and Privacy Policy',
  'Creating Account...': 'Creating Account...',
  'Create Account': 'Create Account',
  'Already have an account?': 'Already have an account?',
  'Sign in here': 'Sign in here'
};

export const t = (key) => translations[key] || key;