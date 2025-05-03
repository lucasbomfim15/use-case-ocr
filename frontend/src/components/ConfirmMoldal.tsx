'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message = 'Deseja mesmo deletar este documento?',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-2xl text-white w-full max-w-sm shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-lg font-bold mb-4">{message}</h2>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                onClick={onCancel}
              >
                Cancelar
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                onClick={onConfirm}
              >
                Deletar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
