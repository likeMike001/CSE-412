import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './searchbar.component';

describe('SearchBar', () => {
  test('calls onSearch with formatted term and type', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'actor');

    const input = screen.getByPlaceholderText(/Enter actor/i);
    await userEvent.type(input, 'christopher nolan');

    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith('Christopher Nolan', 'actor');
  });

  test('does not call onSearch when input is empty', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  test('updates placeholder when type changes', async () => {
    render(<SearchBar onSearch={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(screen.getByPlaceholderText(/Enter genre/i)).toBeInTheDocument();

    await userEvent.selectOptions(select, 'actor');
    expect(screen.getByPlaceholderText(/Enter actor/i)).toBeInTheDocument();
  });
});
