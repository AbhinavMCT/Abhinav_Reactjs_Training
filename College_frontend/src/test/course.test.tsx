import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import "./setupMocks.tsx";
import { MemoryRouter } from 'react-router-dom';
import CourseManagement from '../pages/admin/CourseManagement.tsx';
import AddCourse from '../pages/course/Coursepage.tsx';
import * as CourseApi from '../services/CourseApi.ts';

vi.mock('../services/CourseApi');

describe('Course Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CourseManagement', () => {
    it('fetches and displays courses', async () => {
      vi.mocked(CourseApi.getAllCourses).mockResolvedValue({
        data: { course: [{ id: 1, name: 'React JS', department_name: 'IT' }], totalPages: 1, totalRecords: 1 }
      } as any);

      await act(async () => {
        render(<MemoryRouter><CourseManagement /></MemoryRouter>);
      });

      expect(await screen.findByText('React JS')).toBeDefined();
    });

    it('deletes a course', async () => {
      vi.mocked(CourseApi.getAllCourses).mockResolvedValue({ data: { course: [{ id: 1, name: 'React' }], totalPages: 1, totalRecords: 1 } } as any);
      vi.mocked(CourseApi.deleteCourse).mockResolvedValue({} as any);

      await act(async () => {
        render(<MemoryRouter><CourseManagement /></MemoryRouter>);
      });

      fireEvent.click(await screen.findByText('Delete'));
      await act(async () => {
        fireEvent.click(screen.getByText('Confirm'));
      });

      expect(CourseApi.deleteCourse).toHaveBeenCalledWith(1);
    });
  });

  describe('AddCourse (Form)', () => {
    it('submits form with correct data', async () => {
      vi.mocked(CourseApi.getAllDepartments).mockResolvedValue({ data: { department: [{ id: 1, name: 'IT' }] } } as any);
      vi.mocked(CourseApi.createCourse).mockResolvedValue({} as any);

      await act(async () => {
        render(
          <MemoryRouter>
            <AddCourse  isEditMode={false} />
          </MemoryRouter>
        );
      });

      fireEvent.change(screen.getByLabelText(/Course Name/i), { target: { value: 'Advanced React' } });
      fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: '1' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /add course/i }));
      });

      expect(CourseApi.createCourse).toHaveBeenCalledWith({ name: 'Advanced React', dep_id: 1 });
    });

    it('shows validation errors for empty fields', async () => {
      await act(async () => {
        render(<MemoryRouter><AddCourse  isEditMode={false} /></MemoryRouter>);
      });

      fireEvent.click(screen.getByRole('button', { name: /add course/i }));
      expect(await screen.findByText(/Course name is required/i)).toBeDefined();
    });
  });
});