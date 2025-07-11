'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import TodoList from './TodoList';
import IconButton from '../ui/IconButton';

export default function TodoModal() {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <IconButton
                icon="List"
                label="Todo List"
                onClick={handleOpen}
                isActive={isOpen}
            />
            
            <Modal 
                isOpen={isOpen} 
                onClose={handleClose}
                title="Todo List"
                size="md"
            >
                <TodoList />
            </Modal>
        </>
    );
} 