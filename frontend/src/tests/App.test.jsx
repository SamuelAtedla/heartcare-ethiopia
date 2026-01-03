import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders landing page by default', () => {
        render(<App />);
        expect(screen.getByText(/Trusted Cardiology Experts/i)).toBeInTheDocument();
    });

    it('navigates to login page when clicking Login in Hero', async () => {
        render(<App />);

        // The hero button now says "Patient & Doctor Login"
        const loginBtn = screen.getByText(/Patient & Doctor Login/i);
        fireEvent.click(loginBtn);

        // Should land on Login Page
        expect(screen.getByText(/Enter your phone number to continue/i)).toBeInTheDocument();
    });
});
