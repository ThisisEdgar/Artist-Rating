import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Song from '../components/song';

test('handles user comment input and submission', () => {
    const handleComment = jest.fn();
    const { getByPlaceholderText, getByText } = render(<Song onComment={handleComment} />);
    const input = getByPlaceholderText('Type here...');
    const button = getByText('Submit');

    fireEvent.change(input, { target: { value: 'This is a comment' } });
    expect(input.value).toBe('This is a comment');

    fireEvent.click(button);
    expect(handleComment).toHaveBeenCalledTimes(1);
});