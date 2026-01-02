import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { describe, it, expect, vi } from 'vitest';

// Mock i18next to avoid initialization issues in tests
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, defaultValue) => defaultValue || key,
        i18n: {
            changeLanguage: vi.fn(),
            language: 'en'
        }
    }),
    initReactI18next: {
        type: '3rdParty',
        init: vi.fn(),
    },
}));

describe('App', () => {
    it('renders landing page by default', () => {
        render(<App />);
        expect(screen.getByText(/Professional Heart Care/i)).toBeInTheDocument();
        expect(screen.getByText(/Register Now/i)).toBeInTheDocument();
    });

    it('navigates through booking form steps', async () => {
        render(<App />);
        const registerBtn = screen.getByText('Register Now');
        fireEvent.click(registerBtn);

        // Check if form is visible (it should be on the page)
        expect(screen.getByText('Patient Information')).toBeInTheDocument();

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('09xxxxxxxx'), { target: { value: '0911223344' } });

        // Select date (input type date)
        const dateInput = screen.getByLabelText('Appointment Date'); // We need to ensure label matches
        fireEvent.change(dateInput, { target: { value: '2024-12-31' } });

        // Click Proceed
        const proceedBtn = screen.getByText('Proceed to Payment');
        fireEvent.click(proceedBtn);

        // Should see Payment step
        expect(screen.getByText('Confirm & Pay')).toBeVisible();

        // Click Pay
        const payBtn = screen.getByText('Pay with Telebirr');
        fireEvent.click(payBtn);

        // Should see Confirmation step after timeout
        await waitFor(() => {
            expect(screen.getByText('Booking Confirmed!')).toBeVisible();
        }, { timeout: 3000 });
    });
});
