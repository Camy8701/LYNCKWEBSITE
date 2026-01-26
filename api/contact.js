// Serverless function to handle contact form submissions securely
// This hides the Web3Forms API key from the client-side code
// Compatible with Vercel, Netlify, and other serverless platforms

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Get the API key from environment variable
    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;

    if (!WEB3FORMS_ACCESS_KEY) {
      console.error('WEB3FORMS_ACCESS_KEY environment variable is not set');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Parse the request body
    const formData = req.body;

    // Add the access key to the form data
    const submissionData = {
      ...formData,
      access_key: WEB3FORMS_ACCESS_KEY
    };

    // Forward the request to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(submissionData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Web3Forms error:', result);
      return res.status(response.status).json({
        success: false,
        message: result.message || 'Form submission failed'
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
