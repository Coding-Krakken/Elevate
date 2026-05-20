export default function AccessDenied() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Domain Not Registered</title>
        <style dangerouslySetInnerHTML={{__html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }
          .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            padding: 60px 40px;
            max-width: 700px;
            width: 100%;
            text-align: center;
          }
          h1 {
            font-size: 48px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 16px;
            word-break: break-all;
          }
          .subtitle {
            font-size: 24px;
            color: #4a5568;
            margin-bottom: 12px;
            font-weight: 500;
          }
          .description {
            font-size: 16px;
            color: #718096;
            margin-bottom: 40px;
          }
          .register-section {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 24px;
            margin-bottom: 40px;
          }
          .register-title {
            font-size: 18px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 16px;
            text-align: left;
          }
          .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
          }
          input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #cbd5e0;
            border-radius: 4px;
            font-size: 14px;
          }
          button {
            padding: 12px 32px;
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
          }
          button:hover {
            background: #3182ce;
          }
          .tagline {
            font-size: 14px;
            color: #718096;
            text-align: left;
          }
          .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
          }
          .feature {
            text-align: center;
          }
          .feature-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 12px;
            background: #edf2f7;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4299e1;
            font-size: 24px;
          }
          .feature-title {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
          }
          .feature-desc {
            font-size: 14px;
            color: #718096;
          }
          .footer {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            text-align: center;
          }
          .footer-links {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }
          .footer-link {
            color: white;
            text-decoration: none;
            font-size: 13px;
          }
          .copyright {
            color: rgba(255,255,255,0.8);
            font-size: 12px;
          }
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="card">
            <h1>{typeof window !== 'undefined' ? window.location.hostname : 'exampledomain.com'}</h1>
            <div className="subtitle">This domain is not registered yet.</div>
            <div className="description">This domain may be available for purchase.</div>
            
            <div className="register-section">
              <div className="register-title">Register this domain</div>
              <div className="input-group">
                <input type="text" value={typeof window !== 'undefined' ? window.location.hostname : 'exampledomain.com'} readOnly />
                <button>Register Domain</button>
              </div>
              <div className="tagline">Secure your name and build your online presence.</div>
            </div>
            
            <div className="features">
              <div className="feature">
                <div className="feature-icon">🛡️</div>
                <div className="feature-title">Secure & Trusted</div>
                <div className="feature-desc">Safe and secure domain registration.</div>
              </div>
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div className="feature-title">Fast & Easy</div>
                <div className="feature-desc">Quick registration and instant activation.</div>
              </div>
              <div className="feature">
                <div className="feature-icon">🌐</div>
                <div className="feature-title">All TLDs Available</div>
                <div className="feature-desc">Find the perfect domain extension for you.</div>
              </div>
            </div>
            
            <div style={{fontSize: '14px', color: '#718096'}}>
              Need help? Our support team is here for you.
            </div>
          </div>
        </div>
        
        <div className="footer">
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">WHOIS Lookup</a>
          </div>
          <div className="copyright">© 2024 All rights reserved.</div>
        </div>
      </body>
    </html>
  );
}
