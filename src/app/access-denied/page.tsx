export default function AccessDenied() {
  return (
    <html>
      <head>
        <title>Site Not Available</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #ffffff;
            color: #333333;
            line-height: 1.6;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          h1 {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 16px;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 12px;
          }
          p {
            font-size: 14px;
            color: #666666;
            margin-bottom: 12px;
          }
          .info-box {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 16px;
            margin-top: 24px;
          }
          .info-box h2 {
            font-size: 16px;
            font-weight: 600;
            color: #495057;
            margin-bottom: 12px;
          }
          .info-box p {
            font-size: 13px;
            color: #6c757d;
            margin-bottom: 8px;
          }
          .error-code {
            font-size: 12px;
            color: #999999;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e5e5;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>This site can't be reached</h1>
          
          <p>
            The website at <strong>{typeof window !== 'undefined' ? window.location.hostname : 'this address'}</strong> is not currently available.
          </p>
          
          <p>
            This may be because:
          </p>
          
          <div className="info-box">
            <h2>Access Restricted</h2>
            <p>• This domain requires authorization to access</p>
            <p>• Your device is not registered for this site</p>
            <p>• You may need an invitation link from the site administrator</p>
          </div>
          
          <div className="error-code">
            ERR_ACCESS_DENIED
          </div>
        </div>
      </body>
    </html>
  );
}
