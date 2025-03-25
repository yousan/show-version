import React from 'react';
import './App.css';

// Version information (should be defined as environment variables during build)
const APP_VERSION = process.env.REACT_APP_VERSION || 'v1.3.0-main-a4ea60e'; // Fallback if not injected during build
const BUILD_DATE = process.env.REACT_APP_BUILD_DATE || new Date().toISOString(); // Fallback for build date

// Code examples definition
const CODE_EXAMPLES = {
  simple: `const SimpleVersionDisplay = ({ version }) => (
  <div className="version-badge">
    {version}
  </div>
);`,

  withDate: `const VersionWithDate = () => (
  <div className="version-date-info">
    <div><strong>Version:</strong> {APP_VERSION}</div>
    <div><strong>Build Date:</strong> {new Date(BUILD_DATE).toLocaleString()}</div>
  </div>
);`,

  full: `const FullVersionInfo = () => {
  const commitHash = APP_VERSION.split('-').pop();
  
  return (
    <div className="version-detail">
      <div><strong>Version:</strong> {APP_VERSION}</div>
      <div>
        <strong>Commit:</strong> 
        <a 
          href={\`https://github.com/yousan/show-version/commit/\${commitHash}\`}
          target="_blank" 
          rel="noopener noreferrer"
          className="commit-link"
        >
          {commitHash}
        </a>
      </div>
      <div><strong>Built:</strong> {new Date(BUILD_DATE).toLocaleString()}</div>
    </div>
  );
};`,

  semantic: `const SemanticVersionDisplay = () => {
  const versionNumberMatch = APP_VERSION.match(/v?(\\d+\\.\\d+\\.\\d+)/);
  const versionNumber = versionNumberMatch ? versionNumberMatch[1] : '0.0.0';
  const [major, minor, patch] = versionNumber.split('.').map(Number);
  
  return (
    <div className="semantic-version">
      <div className="version-parts">
        <div className="version-part">
          <span className="version-label">Major</span>
          <span className="version-value">{major}</span>
        </div>
        <div className="version-part">
          <span className="version-label">Minor</span>
          <span className="version-value">{minor}</span>
        </div>
        <div className="version-part">
          <span className="version-label">Patch</span>
          <span className="version-value">{patch}</span>
        </div>
      </div>
      <div className="full-version">{versionNumber}</div>
    </div>
  );
};`,

  history: `const VersionHistory = () => {
  const history = [
    { version: 'v1.3.0', date: '2025-03-25', changes: 'Added datetime format' },
    { version: 'v1.2.1', date: '2025-03-20', changes: 'GitHub Actions auto-release support' },
    // ... other history
  ];
  
  return (
    <div className="version-history">
      <h3>Release History</h3>
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Release Date</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.version}>
              <td>{item.version}</td>
              <td>{item.date}</td>
              <td>{item.changes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};`
};

// 1. Basic version display component
const SimpleVersionDisplay = ({ version }) => (
  <div className="version-badge">
    {version}
  </div>
);

// 2. Version display with date information
const VersionWithDate = () => (
  <div className="version-date-info">
    <div><strong>Version:</strong> {APP_VERSION}</div>
    <div><strong>Build Date:</strong> {new Date(BUILD_DATE).toLocaleString()}</div>
  </div>
);

// 3. Combined version, commit hash, and date display
const FullVersionInfo = () => {
  const commitHash = APP_VERSION.split('-').pop();
  
  return (
    <div className="version-detail">
      <div><strong>Version:</strong> {APP_VERSION}</div>
      <div>
        <strong>Commit:</strong> 
        <a 
          href={`https://github.com/yousan/show-version/commit/${commitHash}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="commit-link"
        >
          {commitHash}
        </a>
      </div>
      <div><strong>Built:</strong> {new Date(BUILD_DATE).toLocaleString()}</div>
    </div>
  );
};

// 4. Semantic version breakdown
const SemanticVersionDisplay = () => {
  const versionNumberMatch = APP_VERSION.match(/v?(\d+\.\d+\.\d+)/);
  const versionNumber = versionNumberMatch ? versionNumberMatch[1] : '0.0.0';
  const [major, minor, patch] = versionNumber.split('.').map(Number);
  
  return (
    <div className="semantic-version">
      <div className="version-parts">
        <div className="version-part">
          <span className="version-label">Major</span>
          <span className="version-value">{major}</span>
        </div>
        <div className="version-part">
          <span className="version-label">Minor</span>
          <span className="version-value">{minor}</span>
        </div>
        <div className="version-part">
          <span className="version-label">Patch</span>
          <span className="version-value">{patch}</span>
        </div>
      </div>
      <div className="full-version">{versionNumber}</div>
    </div>
  );
};

// 5. Version history display (dummy data)
const VersionHistory = () => {
  const history = [
    { version: 'v1.3.0', date: '2025-03-25', changes: 'Added datetime format' },
    { version: 'v1.2.1', date: '2025-03-20', changes: 'GitHub Actions auto-release support' },
    { version: 'v1.2.0', date: '2025-03-15', changes: 'Extended command line options' },
    { version: 'v1.1.0', date: '2025-03-10', changes: 'Improved README and added samples' },
    { version: 'v1.0.0', date: '2025-03-01', changes: 'Initial release' }
  ];
  
  return (
    <div className="version-history">
      <h3>Release History</h3>
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Release Date</th>
            <th>Changes</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.version}>
              <td>{item.version}</td>
              <td>{item.date}</td>
              <td>{item.changes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Version Information Display Sample</h1>
      </header>
      <main className="App-main">
        <section className="version-display-section">
          <h2>1. Simple Version Display</h2>
          <div className="sample-display">
            <SimpleVersionDisplay version={APP_VERSION} />
          </div>
          <div className="code-example">
            <h3>Implementation Code</h3>
            <pre>{CODE_EXAMPLES.simple}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>2. Version Display with Date</h2>
          <div className="sample-display">
            <VersionWithDate />
          </div>
          <div className="code-example">
            <h3>Implementation Code</h3>
            <pre>{CODE_EXAMPLES.withDate}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>3. Detailed Version Information</h2>
          <div className="sample-display">
            <FullVersionInfo />
          </div>
          <div className="code-example">
            <h3>Implementation Code</h3>
            <pre>{CODE_EXAMPLES.full}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>4. Semantic Version Display</h2>
          <div className="sample-display">
            <SemanticVersionDisplay />
          </div>
          <div className="code-example">
            <h3>Implementation Code</h3>
            <pre>{CODE_EXAMPLES.semantic}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>5. Release History</h2>
          <div className="sample-display">
            <VersionHistory />
          </div>
          <div className="code-example">
            <h3>Implementation Code</h3>
            <pre>{CODE_EXAMPLES.history}</pre>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 