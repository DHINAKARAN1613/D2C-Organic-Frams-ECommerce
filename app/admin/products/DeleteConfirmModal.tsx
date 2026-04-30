'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
    loading?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName, loading }: DeleteConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-background rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-red-100"
                    >
                        <div className="p-6 text-center space-y-4">
                            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-foreground">Delete Product?</h3>
                                <p className="text-muted-foreground mt-2">
                                    Are you sure you want to delete <span className="font-semibold text-foreground">"{productName}"</span>?
                                    <br />This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-center pt-2">
                                <Button variant="outline" onClick={onClose} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete It'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
