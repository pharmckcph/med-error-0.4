import React, { useEffect, useState } from 'react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AuditLogViewer } from './components/AuditLogViewer';
import { HeaderBar } from './components/HeaderBar';
import { HosxpImportModal } from './components/HosxpImportModal';
import { MasterManagement } from './components/MasterManagement';
import { ReportDetailModal } from './components/ReportDetailModal';
import { ReportForm } from './components/ReportForm';
import { ReportList } from './components/ReportList';
import { RiskManagementRca } from './components/RiskManagementRca';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { initAuth } from './services/googleWorkspace';
import { store } from './services/store';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('reports');
  const [currentUser, setCurrentUser] = useState<any>(store.getCurrentUser());
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Modals & Active Edit States
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [editingReport, setEditingReport] = useState<any>(null);

  // Initialize Firebase Auth listener for Google Workspace
  useEffect(() => {
    initAuth(
      (user) => setGoogleUser(user),
      () => setGoogleUser(null)
    );
  }, []);

  const handleUserChange = (user: any) => {
    setCurrentUser(user ? { ...user } : null);
  };

  const handleReportCreated = (newReport: any) => {
    setCurrentTab('reports');
    setSelectedReport(newReport);
  };

  const handleReportUpdated = (updatedReport: any) => {
    setEditingReport(null);
    setCurrentTab('reports');
    setSelectedReport(updatedReport);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans">
      {/* Left Sidebar Navigation matching hospital registry UI */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'edit') setEditingReport(null);
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        googleUser={googleUser}
        setGoogleUser={setGoogleUser}
        onNewReport={() => setCurrentTab('new')}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {/* Top Header Bar with hospital brand, user badge, and hero banner */}
          <HeaderBar
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              if (tab !== 'edit') setEditingReport(null);
              setCurrentTab(tab);
            }}
            currentUser={currentUser}
            onUserChange={handleUserChange}
            googleUser={googleUser}
            onNewReport={() => setCurrentTab('new')}
          />

          {currentTab === 'reports' && (
            <ReportList
              onSelectReport={(report) => setSelectedReport(report)}
              onEditReport={(report) => {
                setEditingReport(report);
                setCurrentTab('edit');
              }}
              onNewReport={() => setCurrentTab('new')}
              onOpenRcaTab={() => setCurrentTab('rca')}
              googleUser={googleUser}
            />
          )}

          {currentTab === 'new' && (
            <ReportForm
              isEditMode={false}
              onSuccess={handleReportCreated}
              onCancel={() => setCurrentTab('reports')}
            />
          )}

          {currentTab === 'edit' && editingReport && (
            <ReportForm
              initialData={editingReport}
              isEditMode={true}
              onSuccess={handleReportUpdated}
              onCancel={() => {
                setEditingReport(null);
                setCurrentTab('reports');
              }}
            />
          )}

          {currentTab === 'settings' && (
            <MasterManagement />
          )}

          {(currentTab === 'log' || currentTab === 'audit') && (
            <AuditLogViewer />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>Medication Error Reporting & Safety System (v0.4)</strong>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>Cloudflare D1 Prepared Statements</span>
              <span>•</span>
              <span>Google Sheets API</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onEdit={(report) => {
            setSelectedReport(null);
            setEditingReport(report);
            setCurrentTab('edit');
          }}
          onReportDeleted={() => {
            setSelectedReport(null);
            // Re-trigger re-render by staying on reports
            setCurrentTab('reports');
          }}
        />
      )}

      {/* If logged out, show LoginModal */}
      {!currentUser && (
        <LoginModal
          isOpen={true}
          isMandatory={true}
          onSuccess={(user) => setCurrentUser({ ...user })}
        />
      )}
    </div>
  );
}
