import React, {useRef, useState} from 'react'
import { useBudget } from '../../Context/Context'
import{ FileText, Download, Upload, FileDown, FileSpreadsheet, Filter, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'


function Report() {
    const { exportTransactionsCSV, exportTransactionsExcel, generateMonthlyPDF, previewBankCSV, importBankCSV, loading} = useBudget()

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        type: 'all', // 'all', 'income', 'expense'
        selectedMonth: new Date().getMonth() + 1,
        selectedYear: new Date().getFullYear(),
  });

    const [activeTab, setActiveTab] = useState('export')
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewData, setPreviewData] = useState(null)
    const [bankType, setBankType] = useState(null)
    const fileInputRef = useRef(null)


    const handleCSVExport = async () => {
        const filterData = {
            startDate: filters.startDate,
            endDate: filters.endDate,
            type: filters.type === 'all' ? ' ':filters.type
        }
        await exportTransactionsCSV(filterData);
    }

    const handleExcelExport = async() =>{
        const filterData = {
            startDate: filters.startDate,
            endDate: filters.endDate,
            type: filters.type === 'all'? '': filters.type
        }
        await exportTransactionsExcel(filterData)
    }

    const handleClearFilters = () => {
    setFilters({
        startDate: '',
        endDate: '',
        type: 'all',
        selectedMonth: new Date().getMonth() + 1,
        selectedYear: new Date().getFullYear(),
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months =[
    'January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemver '
  ]

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setSelectedFile(file);
    
    // Preview the file
    const result = await previewBankCSV(file);
    if (result?.ok) {
      setPreviewData(result.data);
      setBankType(result.data.detected_bank || 'generic');
    }
  };


  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const result = await importBankCSV(selectedFile, bankType);
    if (result?.ok) {
      // Clear selection after successful import
      setSelectedFile(null);
      setPreviewData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <div className="min-h-screen text-white bg-[#0b0b0f] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Reports & Analytics</h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base">
          Export your data, generate reports, and import bank statements
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-2 mb-6 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('export')}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'export'
              ? 'bg-primary text-white'
              : 'bg-transparent text-gray-400 hover:bg-[#1a1a1a]'
          }`}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm sm:text-base">Export Data</span>
        </button>

        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'pdf'
              ? 'bg-primary text-white'
              : 'bg-transparent text-gray-400 hover:bg-[#1a1a1a]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm sm:text-base">PDF Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'import'
              ? 'bg-primary text-white'
              : 'bg-transparent text-gray-400 hover:bg-[#1a1a1a]'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm sm:text-base">Import CSV</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* EXPORT TAB */}
        {activeTab === 'export' && (
          <>
            {/* Quick Export Section */}
            <div className="bg-linear-to-br from-blue-600/10 to-purple-600/10 border border-primary/30 rounded-xl p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">Quick Export</h2>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 sm:mb-6">
                Export all your transactions without any filters. Perfect for backups.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => exportTransactionsCSV({})}
                  disabled={loading}
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg flex items-center justify-center gap-3 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileDown className="w-5 h-5" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Export All to CSV</div>
                    <div className="text-xs text-green-200 hidden sm:block">Universal format</div>
                  </div>
                </button>

                <button
                  onClick={() => exportTransactionsExcel({})}
                  disabled={loading}
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg flex items-center justify-center gap-3 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">Export All to Excel</div>
                    <div className="text-xs text-primary hidden sm:block">With summaries</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Filtered Export Section */}
            <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">Export with Filters</h2>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Export specific transactions by date range or type
              </p>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Transactions</option>
                    <option value="income">Income Only</option>
                    <option value="expense">Expense Only</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

            {/* Filter Info */}
              {(filters.startDate || filters.endDate || filters.type !== 'all') && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
                  <p className="text-primary text-sm">
                    <strong>Active Filters:</strong>
                    {filters.startDate && ` From ${filters.startDate}`}
                    {filters.endDate && ` To ${filters.endDate}`}
                    {filters.type !== 'all' && ` • Type: ${filters.type}`}
                  </p>
                </div>
              )}

              {/* Export Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={handleCSVExport}
                  disabled={loading}
                  className="px-4 sm:px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  Export Filtered to CSV
                </button>

                <button
                  onClick={handleExcelExport}
                  disabled={loading}
                  className="px-4 sm:px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  Export Filtered to Excel
                </button>
              </div>
            </div>

            {/* Export Tips */}
            <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">📌 Export Tips</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span> just import and export anything you want make you turn yourself to importer and exporter, this thing don almost make me craze, for code wey..... hmmm make i no talk sha  </span>
                </li>
               
              </ul>
            </div>
          </>
        )}

        {/* PDF REPORTS TAB */}
        {activeTab === 'pdf' && (
          <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Get Your Monthly Pdf Report </h2>
            </div>

            <p className='text-gray-400 text-sm mb-4 sm:mb-6'>
                Create a professional PDF Report with summaries, charts, and detailed breakdowns
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">
                    Select Month
                </label>
                <select
                    value={filters.selectedMonth}
                    onChange={(e) => setFilters({ ...filters, selectedMonth: parseInt(e.target.value) })}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                        {month}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                    <label className="block text-gray-400 text-xs sm:text-sm font-medium mb-2">
                        Select Year
                    </label>
                    <select
                        value={filters.selectedYear}
                        onChange={(e) => setFilters({ ...filters, selectedYear: parseInt(e.target.value) })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                <button
                    onClick={() => generateMonthlyPDF(filters.selectedMonth, filters.selectedYear)}
                    disabled={loading}
                    className="w-full px-4 sm:px-6 py-2 sm:py-2.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                    {loading ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    Generate PDF
                </button>
                </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
                <p className="text-red-300 text-sm">
                📅 Generating report for: <strong>{months[filters.selectedMonth - 1]} {filters.selectedYear}</strong>
                </p>
            </div>

            <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">📄 What's Included in Your PDF Report</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Summary Dashboard:</strong> Total income, expenses, net savings, and savings rate</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong>Top Expense Categories:</strong> See where your money goes with percentages</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">✓</span>
                    <span><strong>Income Sources:</strong> Breakdown of all your income streams</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">✓</span>
                    <span><strong>Recent Transactions:</strong> Detailed list of your latest transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">✓</span>
                    <span><strong>Professional Design:</strong> Beautiful, print-ready format perfect for records</span>
                    </li>
                </ul>
          </div>
         </div>
        )}

        {/* IMPORT CSV TAB */}
        {activeTab === 'import' && (
          <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          <h2 className="text-lg sm:text-xl font-semibold text-white">Import Bank Statement</h2>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Upload your bank statement CSV to automatically create transactions. Supports GTBank, Zenith, Kuda, Access Bank, and more.
        </p>

        {/* File Upload */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Select CSV File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={loading}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary file:cursor-pointer disabled:opacity-50"
            />
          </div>

          {selectedFile && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-primary text-sm">
                📄 Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          {/* Bank Type Selection */}
          {previewData && (
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Select Bank Type
              </label>
              <select
                value={bankType}
                onChange={(e) => setBankType(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gtbank">GTBank</option>
                <option value="zenith">Zenith Bank</option>
                <option value="kuda">Kuda Bank</option>
                <option value="access">Access Bank</option>
                <option value="generic">Generic/Other</option>
              </select>
              <p className="text-gray-500 text-xs mt-2">
                Auto-detected: <strong>{previewData.detected_bank || 'generic'}</strong>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedFile && (
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-lg transition-colors disabled:opacity-50"
              >
                Clear
              </button>
              <button
                onClick={handleImport}
                disabled={loading || !previewData}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Import Transactions
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {previewData && (
        <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Preview</h3>
          
          <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#1a1a1a] p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Total Rows</p>
              <p className="text-white text-xl font-bold">{previewData.row_count}</p>
            </div>
            <div className="bg-[#1a1a1a] p-3 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">Columns</p>
              <p className="text-white text-xl font-bold">{previewData.columns.length}</p>
            </div>
            <div className="bg-[#1a1a1a] p-3 rounded-lg col-span-2">
              <p className="text-gray-400 text-xs mb-1">Detected Bank</p>
              <p className="text-white text-xl font-bold capitalize">{previewData.detected_bank || 'Generic'}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]">
                  {previewData.columns.slice(0, 5).map((col, idx) => (
                    <th key={idx} className="text-left py-2 px-3 text-gray-400 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.preview.slice(0, 5).map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-[#222]">
                    {previewData.columns.slice(0, 5).map((col, colIdx) => (
                      <td key={colIdx} className="py-2 px-3 text-gray-300">
                        {row[col] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-gray-500 text-xs mt-3">
            Showing first 5 rows and columns
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">📋 How to Import</h3>
        <ol className="space-y-2 text-gray-400 text-sm list-decimal list-inside">
          <li>Download your bank statement as CSV from your online banking</li>
          <li>Click "Choose File" and select the CSV file</li>
          <li>Review the preview to ensure data looks correct</li>
          <li>Select your bank type (auto-detected but can be changed)</li>
          <li>Click "Import Transactions" to bulk import</li>
        </ol>
        
        <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-xs">
            ⚠️ <strong>Note:</strong> Duplicate transactions (same date, amount, description) will be automatically skipped.
          </p>
        </div>
      </div>

      {/* Supported Banks */}
      <div className="bg-[#111111] border border-[#2F2F2F] rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">🏦 Supported Banks</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {['GTBank', 'Zenith Bank', 'Kuda Bank', 'Access Bank', 'Other Banks'].map((bank) => (
            <div key={bank} className="bg-[#1a1a1a] p-3 rounded-lg text-center">
              <p className="text-white text-sm font-medium">{bank}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
        )}
      </div>
    </div>
  )
}

export default Report