import React, { useState } from 'react';
import './App.css';

// バージョン情報（本来はビルド時に環境変数として定義されます）
const APP_VERSION = process.env.REACT_APP_VERSION || 'v1.3.0-main-a4ea60e'; // ビルド時に挿入されなかった場合のフォールバック
const BUILD_DATE = process.env.REACT_APP_BUILD_DATE || new Date().toISOString(); // ビルド日時のフォールバック

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
  // バージョンからハッシュ部分を抽出（例：v1.3.0-main-a4ea60e から a4ea60e を取得）
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
  // バージョン文字列から数字部分を抽出 (例: v1.3.0... から 1.3.0 を取得)
  const versionNumberMatch = APP_VERSION.match(/v?(\d+\.\d+\.\d+)/);
  const versionNumber = versionNumberMatch ? versionNumberMatch[1] : '0.0.0';
  
  // メジャー、マイナー、パッチに分解
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

// メインアプリケーション
function App() {
  const [activeTab, setActiveTab] = useState('simple');
  
  // タブコンテンツの定義
  const tabContents = {
    simple: {
      title: '基本的なバージョン表示',
      component: <SimpleVersionDisplay version={APP_VERSION} />,
      description: 'シンプルなバージョン表示コンポーネント。環境変数からバージョン番号を表示します。',
      code: `
const AppVersion = () => (
  <div className="version-badge">
    {process.env.APP_VERSION}
  </div>
);`
    },
    withDate: {
      title: '日時情報付きバージョン',
      component: <VersionWithDate />,
      description: 'バージョン番号に加えてビルド日時も表示します。',
      code: `
const VersionWithDate = () => (
  <div className="version-info">
    <div>Version: {process.env.APP_VERSION}</div>
    <div>Build Date: {new Date(process.env.BUILD_DATE).toLocaleString()}</div>
  </div>
);`
    },
    full: {
      title: '詳細バージョン情報',
      component: <FullVersionInfo />,
      description: 'バージョン番号、コミットハッシュへのリンク、ビルド日時を表示します。',
      code: `
const FullVersionInfo = () => {
  const version = process.env.APP_VERSION;
  const commitHash = version.split('-').pop();
  
  return (
    <div className="version-detail">
      <div><strong>Version:</strong> {version}</div>
      <div><strong>Commit:</strong> 
        <a href={\`https://github.com/your-repo/commit/\${commitHash}\`}>
          {commitHash}
        </a>
      </div>
      <div><strong>Built:</strong> {new Date(process.env.BUILD_DATE).toLocaleString()}</div>
    </div>
  );
};`
    },
    semantic: {
      title: 'セマンティックバージョン',
      component: <SemanticVersionDisplay />,
      description: 'バージョン番号をメジャー、マイナー、パッチの要素に分解して表示します。',
      code: `
const SemanticVersionDisplay = () => {
  const versionNumberMatch = process.env.APP_VERSION.match(/v?(\\d+\\.\\d+\\.\\d+)/);
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
};`
    },
    history: {
      title: 'バージョン履歴',
      component: <VersionHistory />,
      description: 'アプリケーションのバージョン履歴をテーブル形式で表示します。',
      code: `
const VersionHistory = () => {
  const history = [
    { version: 'v1.3.0', date: '2025-03-25', changes: '日時フォーマットを追加' },
    { version: 'v1.2.1', date: '2025-03-20', changes: 'GitHub Actionsによる自動リリース対応' },
    // 省略...
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
    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Show-Version Demo</h1>
        <p>Reactでバージョン情報を表示するサンプル集</p>
      </header>

      <div className="tabs">
        {Object.keys(tabContents).map(key => (
          <button 
            key={key}
            className={activeTab === key ? 'active' : ''}
            onClick={() => setActiveTab(key)}
          >
            {tabContents[key].title}
          </button>
        ))}
      </div>

      <section className="version-sample">
        <h2>{tabContents[activeTab].title}</h2>
        <p>{tabContents[activeTab].description}</p>
        
        <div className="sample-display">
          {tabContents[activeTab].component}
        </div>
        
        <div className="code-example">
          <h3>実装例</h3>
          <pre>{tabContents[activeTab].code}</pre>
        </div>
      </section>

      <section className="build-info">
        <h3>ビルド情報</h3>
        <div className="info-items">
          <div className="info-item">
            <span>現在のアプリバージョン:</span>
            <strong>{APP_VERSION}</strong>
          </div>
          <div className="info-item">
            <span>ビルド日時:</span>
            <strong>{new Date(BUILD_DATE).toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <footer>
        <p>
          <a 
            href="https://github.com/yousan/show-version" 
            target="_blank"
            rel="noopener noreferrer"
            className="App-link"
          >
            GitHub リポジトリ
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App; 