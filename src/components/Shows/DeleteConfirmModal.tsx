import React from 'react';

interface DeleteConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-full sm:max-w-[400px] w-[90%]">
        <h2 className="text-xl sm:text-2xl font-medium mb-4">Confirm Deletion</h2>
        <p className="text-sm sm:text-base mb-6">Are you sure you want to delete this show?</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm bg-red-500 text-white rounded cursor-pointer transition-all duration-200 ease-in-out hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;