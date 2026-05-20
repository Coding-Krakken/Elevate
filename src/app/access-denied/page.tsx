export default function AccessDenied() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>This site can't be reached</title>
        <style dangerouslySetInnerHTML={{__html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #fff;
            color: #202124;
            padding: 14px;
            line-height: 20px;
          }
          #main-frame {
            max-width: 640px;
          }
          h1 {
            color: #202124;
            font-size: 1.5em;
            font-weight: normal;
            line-height: 1.25em;
            margin-bottom: 16px;
          }
          p {
            font-size: .875em;
            color: #5f6368;
            margin-bottom: 11px;
          }
          strong {
            color: #202124;
            font-weight: normal;
          }
          ul {
            margin: 0 0 1em 1.5em;
          }
          li {
            margin-bottom: 0.5em;
            color: #5f6368;
            font-size: .875em;
          }
          #error-information {
            display: none;
          }
          .icon {
            display: none;
          }
        `}} />
      </head>
      <body>
        <div id="main-frame">
          <div id="main-content">
            <div className="icon"></div>
            <h1>This site can't be reached</h1>
            <p>
              Check if there is a typo in the domain name.
            </p>
            <div id="error-information">
              <p>DNS_PROBE_FINISHED_NXDOMAIN</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
