// src/components/JudgeCodeModal.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JudgeCodeModal = ({ isOpen, onSubmit }) => {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(code);
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter Judge Code</DialogTitle>
                    <DialogDescription>
                        This code is required to limit the usage of the app only to judges during the judging period. This helps prevent abuse of the system.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter judge code"
                        required
                    />
                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default JudgeCodeModal;