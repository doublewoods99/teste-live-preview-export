import React, { useRef, useState } from 'react';
import { ResumeEditor } from './components/Editor/ResumeEditor';
import { SimpleRollingPreview } from './components/Preview/SimpleRollingPreview';
import { useResumeStore } from './context/resumeStore';
import { exportToPDF } from './utils/pdfExporter';
import './index.css';

// Simple password configuration
const SITE_PASSWORD = 'teste2024';

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      localStorage.setItem('cviel_authenticated', 'true');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            🔐 Access Required
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            margin: 0
          }}>
            Please enter the password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: error ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff'
              }}
              placeholder="Enter password..."
              required
            />
            {error && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                margin: '6px 0 0 0'
              }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
          >
            🔓 Access Site
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, lineHeight: 1.4 }}>
            💡 This password protects the testing environment.<br/>
            Contact the administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { resume, selectedTemplateId } = useResumeStore();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('cviel_authenticated') === 'true'
  );
  const [previewScale, setPreviewScale] = useState<number>(0.7); // Default 70% scale
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('cviel_authenticated');
    setIsAuthenticated(false);
  };

  const handleExtractPreview = () => {
    if (!previewRef.current) {
      alert('Preview not found! Please wait for the preview to load.');
      return;
    }

    try {
      console.log('🎯 Step 1: Starting Preview extraction...');
      
      // Simple content extraction for debugging
      const textContent = previewRef.current.textContent || '';
      const htmlContent = previewRef.current.outerHTML;
      
      // Log the extracted content to console for inspection
      console.log('Extracted content:', {
        textLength: textContent.length,
        htmlLength: htmlContent.length,
        preview: textContent.substring(0, 200) + '...'
      });
      
      // Show a summary alert
      alert(`✅ Step 1: Extraction Complete!\n\n📄 Text Content: ${textContent.length} characters\n📄 HTML Content: ${htmlContent.length} characters\n\nCheck the browser console for details!`);
      
    } catch (error) {
      console.error('❌ Step 1: Extraction failed:', error);
      alert(`❌ Step 1: Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExportToPDF = async () => {
    if (!previewRef.current) {
      alert('Preview not found! Please wait for the preview to load.');
      return;
    }

    setIsExporting(true);
    
    try {
      console.log('🚀 Starting PDF export process...');
      console.log('📋 Current template:', selectedTemplateId);
      console.log('📋 Preview element ready:', !!previewRef.current);
      
      // Add a small delay to ensure preview is fully rendered
      // This helps prevent race conditions with template switching
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Validate that preview has content before export
      if (!previewRef.current.textContent?.trim()) {
        throw new Error('Preview appears to be empty. Please wait for content to load.');
      }
      
      const contentLength = previewRef.current.textContent.length;
      if (contentLength < 100) {
        console.warn('⚠️ Preview has very little content:', contentLength, 'characters');
      }
      
      const filename = `${resume.content.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      
      console.log('📄 Exporting with settings:', {
        template: selectedTemplateId,
        pageSize: resume.format.pageSize,
        contentLength: contentLength,
        filename: filename
      });
      
      // Pass the user's selected page format to the PDF export
      await exportToPDF(previewRef.current, filename, {
        format: resume.format.pageSize
      });
      
      alert(`✅ PDF exported successfully!\n\nYour PDF "${filename}" has been downloaded!`);
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      alert(`❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Editor Panel */}
      <div style={{ 
        width: '400px', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #e5e7eb',
        overflowY: 'auto' as const,
        position: 'sticky' as const,
        top: 0,
        height: '100vh'
      }}>
        <ResumeEditor />
      </div>

      {/* Preview Panel */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        overflowY: 'auto' as const,
        height: '100vh'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#1f2937', 
            fontSize: '24px',
            fontWeight: 600 
          }}>
            ⚡ React Preview → Serverless PDF Export
          </h2>
           
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              title="Logout from testing site"
            >
              🔓 Logout
            </button>
            {/* Preview Scale Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ 
                fontSize: '14px', 
                color: '#374151',
                fontWeight: '500'
              }}>
                Zoom:
              </label>
              <select
                value={previewScale}
                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value={0.5}>50%</option>
                <option value={0.6}>60%</option>
                <option value={0.7}>70%</option>
                <option value={0.8}>80%</option>
                <option value={0.9}>90%</option>
                <option value={1.0}>100%</option>
                <option value={1.1}>110%</option>
                <option value={1.2}>120%</option>
              </select>
            </div>

            {/* Extract Preview HTML/CSS */}
            <button
              onClick={handleExtractPreview}
              style={{
                padding: '8px 16px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              🔍 Extract HTML
            </button>

            {/* Export to PDF */}
            <button
              onClick={handleExportToPDF}
              disabled={isExporting}
              style={{
                padding: '8px 16px',
                backgroundColor: !isExporting ? '#dc2626' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: !isExporting ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s'
              }}
            >
              {isExporting ? (
                <>
                  <span style={{ 
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                  Generating PDF...
                </>
              ) : (
                <>📄 Export PDF</>
              )}
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div style={{
          transform: `scale(${previewScale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease-in-out',
          marginBottom: previewScale < 1 ? `${(1 - previewScale) * -100}%` : '0'
        }}>
          <div ref={previewRef}>
            <SimpleRollingPreview />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
