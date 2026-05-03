import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export const getInitials = (nameOrEmail) => {
  if (!nameOrEmail) return 'U';

  const parts = nameOrEmail.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return parts[0]?.[0]?.toUpperCase() || 'U';
};

export const normalizeStatus = (status) => {
  return String(status || '').trim().toUpperCase();
};

export const extractList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.borrows)) return res.borrows;
  if (Array.isArray(res?.transactions)) return res.transactions;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

export function SuccessModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[360px] p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Success</h2>
        <p className="text-gray-500 mb-6">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export function DeletePhotoModal({ onCancel, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl w-[390px] p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Delete Profile Photo?
        </h2>

        <p className="text-gray-500 mb-6">
          This will remove your current profile photo from your account.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function PasswordModal({
  passwordForm,
  setPasswordForm,
  passwordError,
  onClose,
  onSubmit
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Change Password</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {passwordError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {passwordError}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]"
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="New password"
            value={passwordForm.newPassword}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]"
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirmPassword}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2563EB]"
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfileInput({ icon, label, value, onChange, disabled }) {
  return (
    <div>
      <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-xl px-5 py-4 text-lg outline-none ${
          disabled
            ? 'bg-gray-50 text-gray-600'
            : 'bg-white focus:ring-2 focus:ring-[#2563EB]'
        }`}
      />
    </div>
  );
}

export function ReadOnlyField({ icon, label, value }) {
  return (
    <div>
      <label className="flex items-center gap-3 text-gray-700 font-semibold mb-2">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>

      <div className="w-full border border-gray-300 rounded-xl px-5 py-4 text-lg bg-gray-50 text-gray-700 break-words">
        {value || 'N/A'}
      </div>
    </div>
  );
}