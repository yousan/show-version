import React from 'react';
import './App.css';

// バージョン情報（本来はビルド時に環境変数として定義されます）
const APP_VERSION = process.env.REACT_APP_VERSION || 'v1.2.1'; // ビルド時に挿入されなかった場合のフォールバック

// バージョン表示コンポーネント
const VersionDisplay = ({ version }) => (
  <div className="version-badge">
    {version}
  </div>
);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Show-Version Demo</h1>
        <p>Reactでバージョン情報を表示するサンプル</p>
      </header>

      <section className="version-info">
        <h2>アプリケーションバージョン</h2>
        <VersionDisplay version={APP_VERSION} />
        <p>このバージョン情報はビルド時にGitリポジトリから抽出されます</p>
      </section>

      <section className="code-example">
        <h2>実装例</h2>
        <h3>1. webpackの設定</h3>
        <pre>{`
const webpack = require('webpack');
const { getVersion } = require('@yousan/show-version');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_VERSION': JSON.stringify(getVersion())
    }),
  ],
};
        `}</pre>
        
        <h3>2. Reactコンポーネント</h3>
        <pre>{`
import React from 'react';

const VersionDisplay = () => (
  <div className="version-badge">
    {process.env.REACT_APP_VERSION}
  </div>
);

export default VersionDisplay;
        `}</pre>
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