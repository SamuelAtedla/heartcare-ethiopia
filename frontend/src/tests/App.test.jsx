import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders landing page by default', () => {
        render(<App />);
        expect(screen.getByText(/Trusted Cardiology Experts/i)).toBeInTheDocument();
    });

    it('navigates to login page when clicking Book Appointment', async () => {
        render(<App />);

        // There might be multiple "Book Appointment" buttons (Header, Hero)
        const bookBtns = screen.getAllByText('Book Appointment');
        fireEvent.click(bookBtns[0]);

        // Should land on Login Page
        expect(screen.getByText(/Enter your phone number to continue/i)).toBeInTheDocument();
    });
});
