import React, { useEffect, useState } from 'react';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import {
  getStudentBorrows,
  returnBorrow,
  getItemPhotoBlobUrl
} from '../../../api/borrowbox';

const CONDITION_OPTIONS = [
  'Good',
  'Damaged',
  'Lost',
  'Needs Inspection'
];

export function WebStudentBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');

  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [returnLoading, setReturnLoading] = useState(false);
  const [returnError, setReturnError] = useState('');
  const [returnCondition, setReturnCondition] = useState('Good');
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    loadBorrows();
  }, []);

  const loadBorrows = async () => {
    setLoading(true);

    try {
      const res = await getStudentBorrows();

      if (res.success) {
        setBorrows(res.borrows || []);
      } else {
        setBorrows([]);
      }
    } catch (err) {
      console.error('Failed to load borrows:', err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  const isActiveBorrow = (borrow) => {
    const status = String(borrow.status || '').toUpperCase();
    return ['ACTIVE', 'BORROWED', 'APPROVED', 'PENDING'].includes(status);
  };

  const currentBorrows = borrows.filter(isActiveBorrow);
  const historyBorrows = borrows.filter((b) => !isActiveBorrow(b));

  const formatDate = (date) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return 'N/A';

    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getItemName = (borrow) =>
    borrow.itemName || borrow.item?.name || borrow.name || 'Unknown Item';

  const getItemLocation = (borrow) =>
    borrow.itemLocation || borrow.item?.location || borrow.location || 'Campus';

  const getCondition = (borrow) =>
    borrow.condition || borrow.itemCondition || 'N/A';

  const getNotes = (borrow) =>
    borrow.notes && borrow.notes.trim() ? borrow.notes : 'No notes provided';

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const openReturnModal = (borrow) => {
    setSelectedBorrow(borrow);
    setReturnCondition('Good');
    setReturnNotes('');
    setReturnError('');
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    if (returnLoading) return;

    setShowReturnModal(false);
    setReturnError('');
    setReturnCondition('Good');
    setReturnNotes('');
  };

  const handleReturn = async () => {
    if (!selectedBorrow || returnLoading) return;

    if (!returnCondition.trim()) {
      setReturnError('Please select the item condition.');
      return;
    }

    setReturnLoading(true);
    setReturnError('');

    try {
      const res = await returnBorrow(
        selectedBorrow.id,
        returnCondition,
        returnNotes.trim()
      );

      if (res.success === false) {
        throw new Error(res.message || 'Failed to return item.');
      }

      setShowReturnModal(false);
      setShowSuccessModal(true);

      await loadBorrows();
    } catch (err) {
      console.error('Failed to return item:', err);

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to return item. Please try again.';

      setReturnError(message);
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">My Borrows</h1>
        <p className="text-xl text-gray-500">Track your borrowed items and history</p>
      </div>

      <div className="flex gap-8 border-b border-gray-200 mb-8 w-full">
        <button
          type="button"
          onClick={() => setActiveTab('current')}
          className={`px-8 py-4 text-xl font-medium border-b-2 ${
            activeTab === 'current'
              ? 'text-[#10B981] border-[#10B981]'
              : 'text-gray-500 border-transparent'
          }`}
        >
          Currently Borrowed ({currentBorrows.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-8 py-4 text-xl font-medium border-b-2 ${
            activeTab === 'history'
              ? 'text-[#10B981] border-[#10B981]'
              : 'text-gray-500 border-transparent'
          }`}
        >
          Borrowing History ({historyBorrows.length})
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-12">Loading borrows...</p>
      ) : activeTab === 'current' ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm w-full max-w-none">
          <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.7fr] px-8 py-5 bg-gray-50 text-gray-500 font-medium">
            <p>ITEM</p>
            <p>BORROW DATE</p>
            <p>DUE DATE</p>
            <p className="text-center">ACTIONS</p>
          </div>

          {currentBorrows.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No currently borrowed items</p>
            </div>
          ) : (
            currentBorrows.map((borrow) => (
              <div
                key={borrow.id}
                className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.7fr] items-center px-8 py-6 border-t border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <BorrowItemImage
                    itemId={borrow.itemId}
                    itemName={getItemName(borrow)}
                    className="w-20 h-20"
                  />

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {getItemName(borrow)}
                    </h3>
                    <p className="text-gray-500">{getItemLocation(borrow)}</p>
                  </div>
                </div>

                <p className="text-lg text-gray-900">
                  {formatDate(borrow.borrowDate)}
                </p>

                <p
                  className={`text-lg ${
                    isOverdue(borrow.dueDate) ? 'text-red-500' : 'text-gray-900'
                  }`}
                >
                  {formatDate(borrow.dueDate)}
                  {isOverdue(borrow.dueDate) && ' (Overdue)'}
                </p>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => openReturnModal(borrow)}
                    className="bg-red-500 text-white px-7 py-3 rounded-xl font-bold hover:bg-red-600"
                  >
                    RETURN ITEM
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm w-full max-w-none">
          <div className="grid grid-cols-[1.5fr_0.9fr_0.55fr_1fr] px-8 py-5 bg-gray-50 text-gray-500 font-medium">
            <p>ITEM</p>
            <p>DATES</p>
            <p className="text-center">CONDITION</p>
            <p>NOTES</p>
          </div>

          {historyBorrows.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No borrowing history yet</p>
            </div>
          ) : (
            historyBorrows.map((borrow) => {
              const returnedLate =
                borrow.returnDate &&
                borrow.dueDate &&
                new Date(borrow.returnDate) > new Date(borrow.dueDate);

              return (
                <div
                  key={borrow.id}
                  className="grid grid-cols-[1.5fr_0.9fr_0.55fr_1fr] items-center px-8 py-6 border-t border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <BorrowItemImage
                      itemId={borrow.itemId}
                      itemName={getItemName(borrow)}
                      className="w-20 h-20"
                    />

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {getItemName(borrow)}
                      </h3>

                      <p className="text-gray-500">{getItemLocation(borrow)}</p>

                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          returnedLate
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {returnedLate ? 'Returned late' : 'Returned on time'}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-900">
                    <p className="text-base">
                      <span className="font-semibold text-gray-500">Borrowed:</span>{' '}
                      {formatDate(borrow.borrowDate)}
                    </p>

                    <p className="text-base mt-2">
                      <span className="font-semibold text-gray-500">Returned:</span>{' '}
                      {formatDate(borrow.returnDate)}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <ConditionBadge condition={getCondition(borrow)} />
                  </div>

                  <p className="text-sm text-gray-600 leading-snug">
                    {getNotes(borrow)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}

      {showReturnModal && selectedBorrow && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="text-center">
              <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />

              <h2 className="text-2xl font-bold mb-3">Return Item</h2>

              <p className="text-gray-600 mb-6">
                Select the condition of{' '}
                <strong>{getItemName(selectedBorrow)}</strong> before returning.
              </p>
            </div>

            <div className="mb-5 text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Item Condition
              </label>

              <select
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value)}
                disabled={returnLoading}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981]"
              >
                {CONDITION_OPTIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5 text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Notes Optional
              </label>

              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                disabled={returnLoading}
                rows={3}
                placeholder="Example: Item is working properly"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] resize-none"
              />
            </div>

            {returnError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-left">
                {returnError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={closeReturnModal}
                disabled={returnLoading}
                className="py-3 border rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReturn}
                disabled={returnLoading}
                className="py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {returnLoading ? 'Returning...' : 'Confirm Return'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-10 w-full max-w-md text-center">
            <CheckCircle className="w-20 h-20 text-[#10B981] mx-auto mb-5" />

            <h2 className="text-2xl font-bold mb-3">Item Returned Successfully!</h2>

            <p className="text-gray-600 mb-8">
              Your item has been moved to borrowing history.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedBorrow(null);
                setReturnError('');
                setReturnCondition('Good');
                setReturnNotes('');
                setActiveTab('history');
              }}
              className="w-full bg-[#10B981] text-white py-3 rounded-xl font-bold"
            >
              View History
            </button>
          </div>
        </div>
      )}
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
    <span className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${classes}`}>
      {value}
    </span>
  );
}

function BorrowItemImage({ itemId, itemName, className = 'w-20 h-20' }) {
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
        className={`${className} rounded-xl object-cover bg-gray-100`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-xl bg-gray-100 flex items-center justify-center text-gray-400`}
    >
      <ImageIcon className="w-7 h-7" />
    </div>
  );
}