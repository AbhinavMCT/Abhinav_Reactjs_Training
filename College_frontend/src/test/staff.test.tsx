import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "./setupMocks.tsx";
import { MemoryRouter } from 'react-router-dom';
import StaffManagement from '../pages/admin/StaffManagement.tsx';
import ViewStaff from '../pages/staff/ViewStaffProfile.tsx';
import * as StaffApi from '../services/StaffApi.ts';

vi.mock('../services/StaffApi');
vi.mock('../pages/staff/EditStaffPage.tsx');

describe('Staff Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('StaffManagement', () => {
    it('fetches and displays staff list', async () => {
      vi.mocked(StaffApi.getAllStaff).mockResolvedValue({
        data: { staff: [{ id: 1, name: 'John Doe', email: 'john@test.com' }], totalPages: 1, totalRecords: 1 }
      } as any);

      await act(async () => {
        render(<MemoryRouter><StaffManagement /></MemoryRouter>);
      });

      expect(await screen.findByText('John Doe')).toBeDefined();
    });

    it('deletes a staff member', async () => {
      vi.mocked(StaffApi.getAllStaff).mockResolvedValue({ data: { staff: [{ id: 1, name: 'John' }], totalPages: 1, totalRecords: 1 } } as any);
      vi.mocked(StaffApi.deleteStaff).mockResolvedValue({} as any);

      await act(async () => {
        render(<MemoryRouter><StaffManagement /></MemoryRouter>);
      });

      fireEvent.click(await screen.findByText('Delete'));
      await act(async () => {
        fireEvent.click(screen.getByText('Confirm'));
      });

      expect(StaffApi.deleteStaff).toHaveBeenCalledWith(1);
    });
  });

  describe('ViewStaff', () => {
    it('displays staff profile details', async () => {
      const mockProfile = { data: { name: 'Alice', email: 'alice@test.com', contact: '1234567890', gender: 'Female', address: { city: 'Kozhikode' } } };
      vi.mocked(StaffApi.getstaffProfile).mockResolvedValue(mockProfile as any);

      await act(async () => {
        render(<MemoryRouter><ViewStaff /></MemoryRouter>);
      });

      expect(await screen.findByText('Alice')).toBeDefined();
      expect(screen.getByText('Kozhikode')).toBeDefined();
    });
  });

  
});