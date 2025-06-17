import { useRef, useState } from 'react';
import { ResumeEditor } from './components/Editor/ResumeEditor';
import { SimpleRollingPreview } from './components/Preview/SimpleRollingPreview';
import { useResumeStore } from './context/resumeStore';
import { extractPreviewContent, logExtractedContent, downloadExtractedContent } from './utils/htmlExtractor';
import { exportToPDF } from './utils/pdfExporter';

function App() {
  const resume = useResumeStore((state) => state.resume);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExtractPreview = () => {
    if (!previewRef.current) {
      alert('Preview not found! Please wait for the preview to load.');
      return;
    }

    try {
      console.log('🎯 Step 1: Starting Preview extraction...');
      const extractedContent = extractPreviewContent(previewRef.current, resume.format.pageSize);
      
      // Log the extracted content to console for inspection
      logExtractedContent(extractedContent);
      
      // Show a summary alert
      alert(`✅ Step 1: Extraction Complete!\n\n📄 Pages Found: ${extractedContent.pages.length}\n📄 Combined HTML: ${extractedContent.html.length} characters\n🎨 CSS: ${extractedContent.css.length} characters\n📋 Complete Document: ${extractedContent.completeDocument.length} characters\n\nCheck the browser console for details!\n\nClick OK to download the extracted HTML file.`);
      
      // Download the complete document
      downloadExtractedContent(extractedContent, 'step1-preview-extracted.html');
      
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
      const filename = `${resume.content.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
      
      // Pass the user's selected page format to the PDF export
      await exportToPDF(previewRef.current, filename, {
        format: resume.format.pageSize
      });
      
      alert(`✅ PDF exported successfully!\n\nYour PDF "${filename}" has been downloaded!`);
    } catch (error) {
      alert(`❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

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
           
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
        <SimpleRollingPreview 
          ref={previewRef}
          resume={resume} 
        />
      </div>
    </div>
    </>
  );
}

export default App;
