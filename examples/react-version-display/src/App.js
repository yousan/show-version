import React from 'react';
import './App.css';

// バージョン情報（本来はビルド時に環境変数として定義されます）
const APP_VERSION = process.env.REACT_APP_VERSION || 'v1.3.0-main-a4ea60e'; // ビルド時に挿入されなかった場合のフォールバック
const BUILD_DATE = process.env.REACT_APP_BUILD_DATE || new Date().toISOString(); // ビルド日時のフォールバック

// コード例の定義
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
    { version: 'v1.3.0', date: '2025-03-25', changes: '日時フォーマットを追加' },
    { version: 'v1.2.1', date: '2025-03-20', changes: 'GitHub Actionsによる自動リリース対応' },
    // ... 他の履歴
  ];
  
  return (
    <div className="version-history">
      <h3>リリース履歴</h3>
      <table>
        <thead>
          <tr>
            <th>バージョン</th>
            <th>リリース日</th>
            <th>変更内容</th>
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

// 1. 基本的なバージョン表示コンポーネント
const SimpleVersionDisplay = ({ version }) => (
  <div className="version-badge">
    {version}
  </div>
);

// 2. 日時情報も含むバージョン表示
const VersionWithDate = () => (
  <div className="version-date-info">
    <div><strong>Version:</strong> {APP_VERSION}</div>
    <div><strong>Build Date:</strong> {new Date(BUILD_DATE).toLocaleString()}</div>
  </div>
);

// 3. バージョン・コミットハッシュ・日時を組み合わせた表示
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

// 4. セマンティックバージョンの分解
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

// 5. バージョン更新履歴を表示（ダミーデータ）
const VersionHistory = () => {
  const history = [
    { version: 'v1.3.0', date: '2025-03-25', changes: '日時フォーマットを追加' },
    { version: 'v1.2.1', date: '2025-03-20', changes: 'GitHub Actionsによる自動リリース対応' },
    { version: 'v1.2.0', date: '2025-03-15', changes: 'コマンドラインオプションの拡張' },
    { version: 'v1.1.0', date: '2025-03-10', changes: 'READMEの改善とサンプル追加' },
    { version: 'v1.0.0', date: '2025-03-01', changes: '初期リリース' }
  ];
  
  return (
    <div className="version-history">
      <h3>リリース履歴</h3>
      <table>
        <thead>
          <tr>
            <th>バージョン</th>
            <th>リリース日</th>
            <th>変更内容</th>
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
        <h1>バージョン情報表示サンプル</h1>
      </header>
      <main className="App-main">
        <section className="version-display-section">
          <h2>1. シンプルなバージョン表示</h2>
          <div className="sample-display">
            <SimpleVersionDisplay version={APP_VERSION} />
          </div>
          <div className="code-example">
            <h3>実装コード</h3>
            <pre>{CODE_EXAMPLES.simple}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>2. 日時情報付きバージョン表示</h2>
          <div className="sample-display">
            <VersionWithDate />
          </div>
          <div className="code-example">
            <h3>実装コード</h3>
            <pre>{CODE_EXAMPLES.withDate}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>3. 詳細なバージョン情報</h2>
          <div className="sample-display">
            <FullVersionInfo />
          </div>
          <div className="code-example">
            <h3>実装コード</h3>
            <pre>{CODE_EXAMPLES.full}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>4. セマンティックバージョン表示</h2>
          <div className="sample-display">
            <SemanticVersionDisplay />
          </div>
          <div className="code-example">
            <h3>実装コード</h3>
            <pre>{CODE_EXAMPLES.semantic}</pre>
          </div>
        </section>

        <section className="version-display-section">
          <h2>5. リリース履歴</h2>
          <div className="sample-display">
            <VersionHistory />
          </div>
          <div className="code-example">
            <h3>実装コード</h3>
            <pre>{CODE_EXAMPLES.history}</pre>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 