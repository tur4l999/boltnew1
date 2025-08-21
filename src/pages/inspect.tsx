import React, { useState, useEffect } from 'react';
import './inspect.css';

interface Asset {
  name: string;
  title: string;
  emoji?: string;
  category: string;
  group: string;
  format: string;
  usage: string;
  sizes: Array<{
    width: number;
    height: number;
    scale: string;
    path: string;
  }>;
  pagesUsed: string[];
  tokenRef?: string;
}

interface Component {
  name: string;
  type: string;
  props: string;
  states: string;
  events: string;
  accessibility: string;
  usage: string;
  status: string;
}

interface Screen {
  name: string;
  route: string;
  params: string;
  description: string;
  components: string;
  states: string;
  status: string;
}

interface AssetsManifest {
  icons: Asset[];
  images: Asset[];
  fonts: Asset[];
  lottie: Asset[];
}

export function InspectPage() {
  const [assetsData, setAssetsData] = useState<AssetsManifest | null>(null);
  const [componentsData, setComponentsData] = useState<Component[]>([]);
  const [screensData, setScreensData] = useState<Screen[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'asset' | 'component' | 'screen' | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    // Load assets manifest
    fetch('/design/assets.manifest.json')
      .then(res => res.json())
      .then(setAssetsData)
      .catch(console.error);

    // Load components CSV
    fetch('/design/components.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {} as any);
        });
        setComponentsData(data);
      })
      .catch(console.error);

    // Load screens CSV
    fetch('/design/screens.csv')
      .then(res => res.text())
      .then(csv => {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {} as any);
        });
        setScreensData(data);
      })
      .catch(console.error);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast or feedback
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Copied to clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  };

  const renderAssetTree = () => {
    if (!assetsData) return null;

    const groupedIcons = assetsData.icons.reduce((acc, icon) => {
      if (!acc[icon.group]) acc[icon.group] = [];
      acc[icon.group].push(icon);
      return acc;
    }, {} as Record<string, Asset[]>);

    const groupedImages = assetsData.images.reduce((acc, image) => {
      if (!acc[image.group]) acc[image.group] = [];
      acc[image.group].push(image);
      return acc;
    }, {} as Record<string, Asset[]>);

    return (
      <div className="tree">
        <div className="tree-section">
          <h3>🎨 Icons</h3>
          {Object.entries(groupedIcons).map(([group, icons]) => (
            <div key={group} className="tree-group">
              <h4>{group}</h4>
              {icons.map(icon => (
                <div
                  key={icon.name}
                  className={`tree-item ${selectedItem?.name === icon.name ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedItem(icon);
                    setSelectedType('asset');
                  }}
                >
                  <span className="icon">{icon.emoji}</span>
                  <span className="name">{icon.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="tree-section">
          <h3>🖼️ Images</h3>
          {Object.entries(groupedImages).map(([group, images]) => (
            <div key={group} className="tree-group">
              <h4>{group}</h4>
              {images.map(image => (
                <div
                  key={image.name}
                  className={`tree-item ${selectedItem?.name === image.name ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedItem(image);
                    setSelectedType('asset');
                  }}
                >
                  <span className="icon">🖼️</span>
                  <span className="name">{image.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="tree-section">
          <h3>🧩 Components</h3>
          {componentsData.map(component => (
            <div
              key={component.name}
              className={`tree-item ${selectedItem?.name === component.name ? 'selected' : ''}`}
              onClick={() => {
                setSelectedItem(component);
                setSelectedType('component');
              }}
            >
              <span className="icon">🧩</span>
              <span className="name">{component.name}</span>
              <span className="type">({component.type})</span>
            </div>
          ))}
        </div>

        <div className="tree-section">
          <h3>📱 Screens</h3>
          {screensData.map(screen => (
            <div
              key={screen.name}
              className={`tree-item ${selectedItem?.name === screen.name ? 'selected' : ''}`}
              onClick={() => {
                setSelectedItem(screen);
                setSelectedType('screen');
              }}
            >
              <span className="icon">📱</span>
              <span className="name">{screen.name}</span>
              <span className="route">({screen.route})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAssetDetails = (asset: Asset) => (
    <div className="details">
      <h2>{asset.title}</h2>
      <div className="preview">
        {asset.emoji && <div className="emoji-preview">{asset.emoji}</div>}
      </div>
      
      <div className="info-grid">
        <div className="info-item">
          <label>Name:</label>
          <span>{asset.name}</span>
        </div>
        <div className="info-item">
          <label>Category:</label>
          <span>{asset.category}</span>
        </div>
        <div className="info-item">
          <label>Group:</label>
          <span>{asset.group}</span>
        </div>
        <div className="info-item">
          <label>Format:</label>
          <span>{asset.format}</span>
        </div>
        <div className="info-item">
          <label>Usage:</label>
          <span>{asset.usage}</span>
        </div>
        <div className="info-item">
          <label>Pages Used:</label>
          <span>{asset.pagesUsed.join(', ')}</span>
        </div>
      </div>

      <h3>Sizes</h3>
      <div className="sizes-grid">
        {asset.sizes.map((size, index) => (
          <div key={index} className="size-item">
            <div className="size-info">
              <strong>{size.width}×{size.height}</strong>
              <span className="scale">{size.scale}</span>
            </div>
            <div className="size-path">{size.path}</div>
            <div className="copy-buttons">
              <button onClick={() => copyToClipboard(size.path)}>
                Copy Path
              </button>
              <button onClick={() => copyToClipboard(`<img src="${size.path}" alt="${asset.title}" />`)}>
                Copy HTML
              </button>
              <button onClick={() => copyToClipboard(`require('${size.path}')`)}>
                Copy RN
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComponentDetails = (component: Component) => (
    <div className="details">
      <h2>{component.name}</h2>
      <div className="component-badge">{component.type}</div>
      
      <div className="info-grid">
        <div className="info-item">
          <label>Props:</label>
          <code>{component.props}</code>
        </div>
        <div className="info-item">
          <label>States:</label>
          <span>{component.states}</span>
        </div>
        <div className="info-item">
          <label>Events:</label>
          <span>{component.events}</span>
        </div>
        <div className="info-item">
          <label>Accessibility:</label>
          <span>{component.accessibility}</span>
        </div>
        <div className="info-item">
          <label>Usage:</label>
          <span>{component.usage}</span>
        </div>
        <div className="info-item">
          <label>Status:</label>
          <span className={`status ${component.status.toLowerCase()}`}>{component.status}</span>
        </div>
      </div>

      <div className="copy-buttons">
        <button onClick={() => copyToClipboard(`<${component.name} />`)}>
          Copy JSX
        </button>
        <button onClick={() => copyToClipboard(`import { ${component.name} } from './components';`)}>
          Copy Import
        </button>
      </div>
    </div>
  );

  const renderScreenDetails = (screen: Screen) => (
    <div className="details">
      <h2>{screen.name}</h2>
      <div className="route-badge">{screen.route}</div>
      
      <div className="info-grid">
        <div className="info-item">
          <label>Description:</label>
          <span>{screen.description}</span>
        </div>
        <div className="info-item">
          <label>Params:</label>
          <code>{screen.params || 'none'}</code>
        </div>
        <div className="info-item">
          <label>States:</label>
          <span>{screen.states}</span>
        </div>
        <div className="info-item">
          <label>Status:</label>
          <span className={`status ${screen.status.toLowerCase()}`}>{screen.status}</span>
        </div>
      </div>

      <h3>Components Used</h3>
      <div className="components-used">
        {screen.components.split('|').map(comp => (
          <button
            key={comp.trim()}
            className="component-chip"
            onClick={() => {
              const component = componentsData.find(c => c.name === comp.trim());
              if (component) {
                setSelectedItem(component);
                setSelectedType('component');
              }
            }}
          >
            {comp.trim()}
          </button>
        ))}
      </div>

      <div className="copy-buttons">
        <button onClick={() => copyToClipboard(screen.route)}>
          Copy Route
        </button>
        <button onClick={() => copyToClipboard(`navigate('${screen.name}')`)}>
          Copy Navigation
        </button>
      </div>
    </div>
  );

  return (
    <div className={`inspect-page ${showGrid ? 'show-grid' : ''}`}>
      <header className="inspect-header">
        <h1>🔍 Design Inspector</h1>
        <div className="header-controls">
          <button
            className={`grid-toggle ${showGrid ? 'active' : ''}`}
            onClick={() => setShowGrid(!showGrid)}
          >
            Grid
          </button>
        </div>
      </header>

      <div className="inspect-content">
        <aside className="inspect-sidebar">
          {renderAssetTree()}
        </aside>

        <main className="inspect-main">
          {selectedItem && selectedType === 'asset' && renderAssetDetails(selectedItem)}
          {selectedItem && selectedType === 'component' && renderComponentDetails(selectedItem)}
          {selectedItem && selectedType === 'screen' && renderScreenDetails(selectedItem)}
          {!selectedItem && (
            <div className="empty-state">
              <h2>Select an item to inspect</h2>
              <p>Choose an asset, component, or screen from the sidebar to view details.</p>
            </div>
          )}
        </main>
      </div>

      {showGrid && <div className="grid-overlay"></div>}
    </div>
  );
}