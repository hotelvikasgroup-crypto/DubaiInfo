import React, { useState, useCallback } from 'react';
import { generateLeadsAndStrategies } from './services/geminiService';
import type { Lead, Strategy } from './types';
import Header from './components/Header';
import LeadTable from './components/LeadTable';
import StrategyCard from './components/StrategyCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import SparklesIcon from './components/icons/SparklesIcon';
import ClipboardIcon from './components/icons/ClipboardIcon';
import InfoIcon from './components/icons/InfoIcon';

const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

 const handleGenerate = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  setLeads([]);
  setStrategies([]);

  const prompt = "Find high-quality Dubai business leads and outreach strategies.";

  try {
    const result = await generateLeadsAndStrategies(prompt);

    if (result && result.leads && result.strategies) {
      setLeads(result.leads);
      setStrategies(result.strategies);
    } else {
      setError("Received an invalid or empty response from the AI. Please try again.");
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "An unknown error occurred.");
  } finally {
    setIsLoading(false);
  }
}, []);

  const handleCopyToClipboard = useCallback(() => {
    if (leads.length === 0) return;

    const headers = ["Business Name", "Industry", "Location", "Contact", "Reason for Lead"];
    
    const sanitizeField = (field: string | undefined | null): string => {
        if (field === null || typeof field === 'undefined') {
            return '';
        }
        const stringField = String(field);
        return stringField.replace(/(\r\n|\n|\r|\t)/gm, " "); // remove newlines and tabs
    };

    const tsvRows = [
      headers.join('\t'),
      ...leads.map(lead => [
        sanitizeField(lead.businessName),
        sanitizeField(lead.industry),
        sanitizeField(lead.location),
        sanitizeField(lead.contact),
        sanitizeField(lead.reason),
      ].join('\t'))
    ];

    const tsvString = tsvRows.join('\n');
    
    navigator.clipboard.writeText(tsvString).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      setError('Could not copy to clipboard. Your browser might not support this feature or permissions might be denied.');
    });
  }, [leads]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Unlock Your Next Big Client in Dubai</h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Click the button below to generate a curated list of potential business leads in Dubai that could benefit from your marketing and growth services, along with tailored outreach strategies.
          </p>
          <p className="text-sm text-slate-500 max-w-3xl mx-auto mt-3 flex items-center justify-center gap-2" role="status">
            <InfoIcon className="h-4 w-4 flex-shrink-0" />
            <span>Lead generation is now focused on exhibitors for the Arabian Travel Mart.</span>
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-live="polite"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon />
                Find High-Quality Leads
              </>
            )}
          </button>
        </div>

        {error && <ErrorMessage message={error} />}

        {leads.length > 0 && (
          <div className="space-y-16">
            <section aria-labelledby="leads-heading">
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 text-center">
                <h3 id="leads-heading" className="text-3xl font-bold text-amber-400">Potential Business Leads</h3>
                <button
                  onClick={handleCopyToClipboard}
                  disabled={isCopied}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 disabled:bg-green-700 disabled:cursor-default"
                  aria-label="Copy leads for Google Sheets"
                >
                  <ClipboardIcon className="h-5 w-5" />
                  {isCopied ? 'Copied to Clipboard!' : 'Copy for Sheets'}
                </button>
              </div>
              <LeadTable leads={leads} />
            </section>

            <section aria-labelledby="strategies-heading">
              <h3 id="strategies-heading" className="text-3xl font-bold text-center mb-8 text-amber-400">Strategic Outreach Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {strategies.map((strategy, index) => (
                  <StrategyCard key={index} strategy={strategy} index={index} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-500">
        <p>&copy; {new Date().getFullYear()} Dubai Business Lead Generator. Powered by AI.</p>
      </footer>
    </div>
  );
};

export default App;
