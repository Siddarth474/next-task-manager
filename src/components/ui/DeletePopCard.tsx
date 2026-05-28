"use client"

import { Loader2Icon, Trash2, X } from "lucide-react";

interface DeleteConfirmCardProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirmCard({ onConfirm, onCancel, loading }: DeleteConfirmCardProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-9999">
      <div className="bg-white w-[90%] max-w-sm rounded-2xl shadow-2xl p-6 text-center relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Trash2 className="text-indigo-500" size={36} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Delete this task?
          </h2>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>

          <div className="flex justify-center gap-4 mt-5 w-full">
            <button
              onClick={onCancel}
              className="w-1/2 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-1/2 py-2.5 rounded-xl flex justify-center bg-indigo-500 text-white font-medium
               hover:bg-indigo-600 transition"
            >
              {loading ? <Loader2Icon size={20} className="animate-spin" /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
