import React, { useEffect, useMemo, useState } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { getAllBorrows, getItemPhotoBlobUrl } from '../../../api/borrowbox';

export function WebOfficerTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);

    try {
      const res = await getAllBorrows();
      const borrows = res?.borrows || [];

      const normalized = borrows.map((borrow, index) =>
        normalizeBorrowTransaction(borrow, index)
      );

      setTransactions(normalized);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const totalTransactions = transactions.length;

  const activeBorrows = useMemo(() => {
    return transactions.filter((tx) =>
      ['ACTIVE', 'BORROWED', 'APPROVED', 'PENDING'].includes(tx.rawStatus)
    );
  }, [transactions]);

  const returnedTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.rawStatus === 'RETURNED');
  }, [transactions]);

  const returnRate = totalTransactions
    ? Math.round((returnedTransactions.length / totalTransactions) * 100)
    : 0;

  const displayedTransactions = useMemo(() => {
    if (activeTab === 'borrowed') return activeBorrows;
    if (activeTab === 'returned') return returnedTransactions;
    return transactions;
  }, [activeTab, transactions, activeBorrows, returnedTransactions]);

  const exportToCSV = () => {
    const headers = [
      'Student Name',
      'Student ID',
      'Item',
      'Serial Number',
      'Borrow Date',
      'Due Date',
      'Return Date',
      'Status',
      'Condition',
      'Notes',
    ];

    const rows = displayedTransactions.map((tx) => [
      csvEscape(cleanText(tx.studentName)),
      csvEscape(cleanText(tx.studentIdentifier)),
      csvEscape(cleanText(tx.itemName)),
      csvEscape(cleanText(tx.serialNumber)),
      csvEscape(formatReadableDate(tx.borrowDate)),
      csvEscape(formatReadableDate(tx.dueDate)),
      csvEscape(formatReadableDate(tx.returnDate)),
      csvEscape(cleanText(tx.displayStatus)),
      csvEscape(cleanText(tx.condition)),
      csvEscape(cleanText(tx.notes)),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      `borrowbox-transactions-${new Date().toISOString().split('T')[0]}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
            All Borrowing Transactions
          </h1>
          <p className="text-[#64748B] text-lg">
            Monitor and track all borrowing activity
          </p>
        </div>

        <button
          type="button"
          onClick={exportToCSV}
          className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard label="Total Transactions" value={totalTransactions} />
        <SummaryCard label="Active Borrows" value={activeBorrows.length} blue />
        <SummaryCard label="Return Rate" value={`${returnRate}%`} green />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">
        <div className="flex flex-wrap gap-3">
          <TabButton
            label="All Transactions"
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />

          <TabButton
            label="Currently Borrowed"
            active={activeTab === 'borrowed'}
            onClick={() => setActiveTab('borrowed')}
          />

          <TabButton
            label="Returned"
            active={activeTab === 'returned'}
            onClick={() => setActiveTab('returned')}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1150px]">
            <div className="grid grid-cols-[1.35fr_1fr_1fr_0.7fr_0.8fr_1fr] px-8 py-6 bg-white border-b border-gray-200 text-[#64748B] font-medium">
              <p>ITEM</p>
              <p>STUDENT</p>
              <p>DATES</p>
              <p>STATUS</p>
              <p>CONDITION</p>
              <p>NOTES</p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-[#64748B]">
                Loading transactions...
              </div>
            ) : displayedTransactions.length === 0 ? (
              <div className="p-10 text-center text-[#64748B]">
                No transactions found.
              </div>
            ) : (
              displayedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-[1.35fr_1fr_1fr_0.7fr_0.8fr_1fr] items-center px-8 py-6 border-b border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <TransactionItemImage
                      itemId={tx.itemId}
                      itemName={tx.itemName}
                    />

                    <div>
                      <h3 className="text-[18px] font-semibold text-[#0F172A] leading-snug">
                        {tx.itemName}
                      </h3>

                      <p className="text-[#64748B] text-sm mt-1">
                        Serial #: {tx.serialNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[18px] font-semibold text-[#0F172A] leading-snug">
                      {tx.studentName}
                    </p>

                    <p className="text-[#64748B] text-sm mt-1 break-all">
                      {tx.studentIdentifier}
                    </p>
                  </div>

                  <div className="text-[#334155] text-sm leading-relaxed">
                    <p>
                      <span className="font-semibold text-[#64748B]">Borrowed:</span>{' '}
                      {formatReadableDate(tx.borrowDate)}
                    </p>

                    <p>
                      <span className="font-semibold text-[#64748B]">Due:</span>{' '}
                      {formatReadableDate(tx.dueDate)}
                    </p>

                    <p>
                      <span className="font-semibold text-[#64748B]">Returned:</span>{' '}
                      {formatReadableDate(tx.returnDate)}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusClasses(
                        tx.rawStatus
                      )}`}
                    >
                      {tx.displayStatus}
                    </span>
                  </div>

                  <div>
                    <ConditionBadge condition={tx.condition} />
                  </div>

                  <p className="text-[#64748B] text-sm leading-snug">
                    {tx.notes && tx.notes.trim() ? tx.notes : 'No notes'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, blue, green }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <p className="text-[#64748B] text-sm mb-3">{label}</p>
      <p
        className={`text-4xl font-bold ${
          blue ? 'text-[#2563EB]' : green ? 'text-[#10B981]' : 'text-[#0F172A]'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-semibold transition-colors ${
        active
          ? 'bg-[#2563EB] text-white'
          : 'bg-[#F1F5F9] text-[#334155] hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function normalizeBorrowTransaction(borrow, index) {
  const rawStatus = String(borrow?.status || '').toUpperCase();
  const displayStatus = rawStatus === 'ACTIVE' ? 'BORROWED' : rawStatus || 'N/A';

  const studentName =
    borrow?.studentName ||
    borrow?.studentFullName ||
    borrow?.fullName ||
    borrow?.studentEmail ||
    borrow?.studentId ||
    'Unknown Student';

  const studentIdentifier =
    borrow?.studentIdentifier ||
    borrow?.studentNumber ||
    borrow?.studentCode ||
    borrow?.studentEmail ||
    borrow?.studentId ||
    'N/A';

  return {
    id: borrow?.id || `borrow-${index}`,
    itemId: borrow?.itemId || borrow?.item?.id || '',
    itemName: borrow?.itemName || borrow?.item?.name || 'Unknown Item',
    itemLocation:
      borrow?.itemLocation ||
      borrow?.location ||
      borrow?.item?.location ||
      'Campus',
    serialNumber: borrow?.serialNumber || borrow?.item?.serialNumber || 'N/A',

    studentName,
    studentIdentifier,

    borrowDate: borrow?.borrowDate || borrow?.createdAt || null,
    dueDate: borrow?.dueDate || null,
    returnDate: borrow?.returnDate || null,

    rawStatus,
    displayStatus,

    condition: borrow?.condition || 'N/A',
    notes: borrow?.notes || '',
  };
}

function TransactionItemImage({ itemId, itemName }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let active = true;
    let currentUrl = null;

    const loadImage = async () => {
      setUrl(null);

      if (!itemId) return;

      const blobUrl = await getItemPhotoBlobUrl(itemId);

      if (active && blobUrl) {
        currentUrl = blobUrl;
        setUrl(blobUrl);
      }
    };

    loadImage();

    return () => {
      active = false;

      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [itemId]);

  if (url) {
    return (
      <img
        src={url}
        alt={itemName || 'Item'}
        className="w-16 h-16 rounded-2xl object-cover border border-gray-200 bg-white shrink-0"
      />
    );
  }

  return (
    <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
      <ImageIcon className="w-7 h-7 text-gray-400" />
    </div>
  );
}

function ConditionBadge({ condition }) {
  const value = condition || 'N/A';
  const normalized = value.toUpperCase();

  let classes = 'bg-gray-100 text-gray-600';

  if (normalized === 'GOOD') {
    classes = 'bg-green-100 text-green-700';
  } else if (normalized === 'DAMAGED') {
    classes = 'bg-red-100 text-red-700';
  } else if (normalized === 'LOST') {
    classes = 'bg-orange-100 text-orange-700';
  } else if (normalized === 'NEEDS INSPECTION') {
    classes = 'bg-yellow-100 text-yellow-700';
  }

  return (
    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${classes}`}>
      {value}
    </span>
  );
}

function getStatusClasses(status) {
  if (['ACTIVE', 'BORROWED', 'APPROVED', 'PENDING'].includes(status)) {
    return 'bg-blue-100 text-[#2563EB]';
  }

  if (status === 'RETURNED') {
    return 'bg-green-100 text-[#10B981]';
  }

  return 'bg-gray-100 text-gray-600';
}

function formatReadableDate(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function cleanText(value) {
  if (value === null || value === undefined || value === '') return 'N/A';

  const text = String(value).trim();
  return text === '' ? 'N/A' : text;
}

function csvEscape(value) {
  const safe = value == null ? '' : String(value);
  return `"${safe.replace(/"/g, '""')}"`;
}